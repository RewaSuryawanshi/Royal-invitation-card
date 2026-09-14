import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, InvitationCard, RSVPResponse } from '../types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Named Firestore Database Support
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Firebase Auth
export const auth = getAuth(app);

// Helper to sanitize data for Firestore (remove undefined values)
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export const FirebaseService = {
  // Collections references
  usersRef: collection(db, 'users'),
  cardsRef: collection(db, 'cards'),
  rsvpsRef: collection(db, 'rsvps'),

  // --- USER AUTHENTICATION & PROFILE DETAILS ---

  /**
   * Register a new user in Firebase Auth and save full profile details to Firestore 'users'
   */
  async registerUser(name: string, email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const pass = password || 'password123';

    try {
      let firebaseUid: string | null = null;

      // 1. Try registering through Firebase Authentication
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        firebaseUid = cred.user.uid;
        try {
          await updateProfile(cred.user, {
            displayName: cleanName,
            photoURL: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`
          });
        } catch {
          // ignore profile update error
        }
      } catch (authError: any) {
        console.warn('Firebase Auth register notice:', authError?.code, authError?.message);
        
        if (authError?.code === 'auth/email-already-in-use') {
          return { success: false, error: 'An account with this email already exists in Firebase. Please sign in instead.' };
        }
        if (authError?.code === 'auth/weak-password') {
          return { success: false, error: 'Password is too weak. Please use at least 6 characters.' };
        }
        if (authError?.code === 'auth/invalid-email') {
          return { success: false, error: 'The email address format is invalid.' };
        }
        // If Email/Password provider is not enabled in Firebase Console (e.g. auth/operation-not-allowed),
        // we smoothly persist the user into Firebase Firestore's 'users' collection!
      }

      // Check if user already exists in Firestore 'users'
      const existingUserQuery = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const existingSnap = await getDocs(existingUserQuery);
      if (!existingSnap.empty) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }

      const userId = firebaseUid || `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newUser: User = {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        password: pass,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`
      };

      // 2. Persist user details into Firestore 'users/{userId}'
      await setDoc(doc(db, 'users', userId), sanitizeForFirestore({
        ...newUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }), { merge: true });

      return { success: true, user: newUser };
    } catch (err: any) {
      console.error('Failed to register user in Firebase:', err);
      return { 
        success: false, 
        error: err?.message || 'Could not complete registration in Firebase. Please check details.' 
      };
    }
  },

  /**
   * Log in user using Firebase Auth or verify from Firestore 'users' collection
   */
  async loginUser(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const pass = password || 'password123';

    try {
      let matchedUser: User | null = null;

      // 1. Try Firebase Auth sign in
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        // Fetch profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (userDoc.exists()) {
          matchedUser = userDoc.data() as User;
        } else {
          matchedUser = {
            id: cred.user.uid,
            name: cred.user.displayName || cleanEmail.split('@')[0],
            email: cred.user.email || cleanEmail,
            avatar: cred.user.photoURL || undefined
          };
          // Save missing record
          await setDoc(doc(db, 'users', cred.user.uid), sanitizeForFirestore({
            ...matchedUser,
            createdAt: new Date().toISOString()
          }), { merge: true });
        }
      } catch (authErr: any) {
        console.warn('Firebase Auth sign in notice, checking Firestore users collection:', authErr?.code || authErr?.message);
        
        // If auth failed with wrong password, return error
        if (authErr?.code === 'auth/wrong-password' || authErr?.code === 'auth/invalid-credential') {
          return { success: false, error: 'Invalid password. Please verify your credentials.' };
        }
      }

      // 2. If not matched yet via Firebase Auth, query Firestore 'users' by email
      if (!matchedUser) {
        const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data() as User;
          if (docData.password && docData.password !== pass) {
            return { success: false, error: 'Invalid password. Please verify your credentials.' };
          }
          matchedUser = {
            id: snap.docs[0].id,
            name: docData.name,
            email: docData.email,
            avatar: docData.avatar,
            password: docData.password
          };
        }
      }

      if (matchedUser) {
        return { success: true, user: matchedUser };
      }

      return { 
        success: false, 
        error: 'No account found with this email. Please check your spelling or sign up.' 
      };
    } catch (err: any) {
      console.error('Firebase login error:', err);
      return { success: false, error: err?.message || 'Login failed. Please try again.' };
    }
  },

  /**
   * Sign in using Google (which is enabled in Firebase Console Authentication)
   */
  async loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const user: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`
      };

      // Save user to Firestore 'users/{uid}'
      await setDoc(doc(db, 'users', fbUser.uid), sanitizeForFirestore({
        ...user,
        updatedAt: new Date().toISOString()
      }), { merge: true });

      return { success: true, user };
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in window was closed before completing.' };
      }
      if (err?.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Sign-in cancelled.' };
      }
      if (err?.code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'your-domain';
        return { 
          success: false, 
          error: `Domain not authorized for Google OAuth yet: "${host}" is not added in Firebase Console -> Authentication -> Settings -> Authorized domains. You can sign in immediately using Email & Password below, or add "${host}" to your Firebase project.` 
        };
      }
      return { 
        success: false, 
        error: err?.message || 'Google authentication failed. Please try again.' 
      };
    }
  },

  /**
   * Log out user from Firebase
   */
  async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  },

  /**
   * Real-time listener for Firebase Auth changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as User);
            return;
          }
        } catch (e) {
          console.warn('Could not read user doc on auth change:', e);
        }
        callback({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || undefined
        });
      } else {
        callback(null);
      }
    });
  },

  // --- INVITATION CARDS DETAILS PERSISTENCE ---

  /**
   * Save or update an invitation card in Firestore 'cards/{cardId}'
   */
  async saveCard(card: InvitationCard, userId: string): Promise<InvitationCard> {
    const updatedCard: InvitationCard = {
      ...card,
      userId,
      updatedAt: new Date().toISOString()
    };

    try {
      const cardDocRef = doc(db, 'cards', card.id);
      await setDoc(cardDocRef, sanitizeForFirestore(updatedCard), { merge: true });
      return updatedCard;
    } catch (error) {
      console.error('Failed to save card to Firebase Firestore:', error);
      throw error;
    }
  },

  /**
   * Delete an invitation card from Firestore 'cards/{cardId}'
   */
  async deleteCard(cardId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'cards', cardId));
    } catch (error) {
      console.error('Failed to delete card from Firebase Firestore:', error);
      throw error;
    }
  },

  /**
   * Fetch all invitation cards owned by a specific user from Firestore
   */
  async getUserCards(userId: string): Promise<InvitationCard[]> {
    try {
      const q = query(
        collection(db, 'cards'), 
        where('userId', '==', userId)
      );
      const snap = await getDocs(q);
      const cards: InvitationCard[] = [];
      snap.forEach((d) => {
        cards.push(d.data() as InvitationCard);
      });
      return cards;
    } catch (error) {
      console.error('Error fetching cards from Firebase:', error);
      return [];
    }
  },

  /**
   * Real-time listener for all cards belonging to a user in Firestore
   */
  subscribeToUserCards(userId: string, onUpdate: (cards: InvitationCard[]) => void): () => void {
    const q = query(collection(db, 'cards'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const cards: InvitationCard[] = [];
      snap.forEach((d) => {
        cards.push(d.data() as InvitationCard);
      });
      onUpdate(cards);
    }, (error) => {
      console.warn('subscribeToUserCards snapshot error:', error);
    });
  },

  /**
   * Fetch a single invitation card by ID or slug from Firestore
   */
  async getCardById(cardIdOrSlug: string): Promise<InvitationCard | null> {
    try {
      // First try by direct document ID
      const directRef = doc(db, 'cards', cardIdOrSlug);
      const directSnap = await getDoc(directRef);
      if (directSnap.exists()) {
        return directSnap.data() as InvitationCard;
      }

      // Then try searching by slug
      const q = query(collection(db, 'cards'), where('slug', '==', cardIdOrSlug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as InvitationCard;
      }

      return null;
    } catch (error) {
      console.error('Error fetching card by ID from Firebase:', error);
      return null;
    }
  },

  // --- RSVP GUEST DETAILS PERSISTENCE ---

  /**
   * Save a new guest RSVP response to Firestore 'rsvps/{rsvpId}'
   */
  async saveRSVP(rsvp: Omit<RSVPResponse, 'id' | 'createdAt'>): Promise<RSVPResponse> {
    const newRSVP: RSVPResponse = {
      ...rsvp,
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'rsvps', newRSVP.id), sanitizeForFirestore(newRSVP));
      return newRSVP;
    } catch (error) {
      console.error('Failed to save RSVP to Firebase Firestore:', error);
      throw error;
    }
  },

  /**
   * Fetch all RSVPs for a given card from Firestore
   */
  async getRSVPsForCard(cardId: string): Promise<RSVPResponse[]> {
    try {
      const q = query(collection(db, 'rsvps'), where('cardId', '==', cardId));
      const snap = await getDocs(q);
      const rsvps: RSVPResponse[] = [];
      snap.forEach((d) => {
        rsvps.push(d.data() as RSVPResponse);
      });
      return rsvps;
    } catch (error) {
      console.error('Error fetching RSVPs from Firebase:', error);
      return [];
    }
  },

  /**
   * Real-time listener for live RSVP updates from guests
   */
  subscribeToRSVPs(cardId: string, onUpdate: (rsvps: RSVPResponse[]) => void): () => void {
    const q = query(collection(db, 'rsvps'), where('cardId', '==', cardId));
    return onSnapshot(q, (snap) => {
      const rsvps: RSVPResponse[] = [];
      snap.forEach((d) => {
        rsvps.push(d.data() as RSVPResponse);
      });
      onUpdate(rsvps);
    }, (err) => {
      console.warn('Real-time RSVP listener notice:', err);
    });
  },

  /**
   * Seed default demo cards, users, and RSVPs into Firebase Firestore
   * so they appear directly in the Firebase Console collections.
   */
  async seedFirestoreWithDefaults(
    defaultUsers: User[],
    defaultCards: InvitationCard[],
    defaultRsvps: RSVPResponse[]
  ): Promise<{ success: boolean; seededCount: number; error?: string }> {
    try {
      let count = 0;

      // 1. Seed users to 'users/{userId}'
      for (const user of defaultUsers) {
        const userDocRef = doc(db, 'users', user.id);
        const existing = await getDoc(userDocRef);
        if (!existing.exists()) {
          await setDoc(userDocRef, sanitizeForFirestore({
            ...user,
            createdAt: new Date().toISOString()
          }), { merge: true });
          count++;
        }
      }

      // 2. Seed cards to 'cards/{cardId}'
      for (const card of defaultCards) {
        const cardDocRef = doc(db, 'cards', card.id);
        const existing = await getDoc(cardDocRef);
        if (!existing.exists()) {
          await setDoc(cardDocRef, sanitizeForFirestore(card), { merge: true });
          count++;
        }
      }

      // 3. Seed RSVPs to 'rsvps/{rsvpId}'
      for (const rsvp of defaultRsvps) {
        const rsvpDocRef = doc(db, 'rsvps', rsvp.id);
        const existing = await getDoc(rsvpDocRef);
        if (!existing.exists()) {
          await setDoc(rsvpDocRef, sanitizeForFirestore(rsvp), { merge: true });
          count++;
        }
      }

      return { success: true, seededCount: count };
    } catch (err: any) {
      console.error('Error seeding Firebase Firestore:', err);
      return { success: false, seededCount: 0, error: err?.message };
    }
  }
};
