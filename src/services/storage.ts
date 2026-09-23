import { User, InvitationCard, ColorTheme, RSVPResponse } from '../types';
import { FirebaseService } from './firebase';

import udaipur3dBg from '../assets/images/theme_udaipur_3d_1790163837447.jpg';
import sheeshMahal3dBg from '../assets/images/theme_sheesh_mahal_3d_1790163854032.jpg';
import varanasiAarti3dBg from '../assets/images/theme_varanasi_aarti_3d_1790163869104.jpg';
import kashmirBagh3dBg from '../assets/images/theme_kashmir_bagh_3d_1790163882628.jpg';

export const THEME_PRESETS: ColorTheme[] = [
  {
    id: 'udaipur-royal-3d',
    name: 'Udaipur Royal Jharokha 3D',
    styleTag: 'Rajputana Heritage',
    description: 'Opulent carved marble jharokhas, cascading marigold petals, and regal 24K gold foil relief.',
    bgImageUrl: udaipur3dBg,
    archType: 'udaipur-jharokha',
    particlesType: 'marigold',
    glowColor: '#E7C878',
    ornamentStyle: 'rajputana',
    is3D: true,
    maroon: '#581020',
    maroonDeep: '#340812',
    gold: '#D4AF37',
    goldLight: '#F7E7A9',
    ivory: '#FDFBF7',
    teal: '#16382E',
    blush: '#F3C5C5',
    ink: '#241016',
  },
  {
    id: 'jaipur-sheesh-mahal-3d',
    name: 'Jaipur Sheesh Mahal 3D',
    styleTag: 'Mirrored Palace & Emerald',
    description: 'Faceted convex mirror mosaics, imperial emerald velvet, and romantic rose petal drifts.',
    bgImageUrl: sheeshMahal3dBg,
    archType: 'sheesh-mahal',
    particlesType: 'mirrors',
    glowColor: '#80E5A7',
    ornamentStyle: 'sheesh',
    is3D: true,
    maroon: '#0B2B1E',
    maroonDeep: '#061911',
    gold: '#CCA43B',
    goldLight: '#E8D288',
    ivory: '#F4F8F5',
    teal: '#13402C',
    blush: '#C2E5D0',
    ink: '#0D2117',
  },
  {
    id: 'varanasi-aarti-3d',
    name: 'Varanasi Sacred Aarti 3D',
    styleTag: 'Ghats Diya Twilight',
    description: 'Ceremonial temple flames, glowing floating brass diyas, sacred vermilion & antique brass bells.',
    bgImageUrl: varanasiAarti3dBg,
    archType: 'varanasi-mandap',
    particlesType: 'diyas',
    glowColor: '#FFB347',
    ornamentStyle: 'temple',
    is3D: true,
    maroon: '#50170A',
    maroonDeep: '#2D0B03',
    gold: '#E59500',
    goldLight: '#FFD166',
    ivory: '#FFFDF9',
    teal: '#1F2A38',
    blush: '#F4A261',
    ink: '#2B1209',
  },
  {
    id: 'kashmir-mughal-bagh-3d',
    name: 'Kashmir Shalimar Bagh 3D',
    styleTag: 'Ivory Jali & Lotus',
    description: 'Carved marble jali lattice, ethereal floating pink lotuses, and twilight turquoise water fountains.',
    bgImageUrl: kashmirBagh3dBg,
    archType: 'mughal-jali',
    particlesType: 'lotus',
    glowColor: '#72DDF7',
    ornamentStyle: 'mughal',
    is3D: true,
    maroon: '#113537',
    maroonDeep: '#081D1E',
    gold: '#D4AF37',
    goldLight: '#F3E5AB',
    ivory: '#F8FAF9',
    teal: '#1B4D4F',
    blush: '#F3C5D9',
    ink: '#0B1E1F',
  },
  {
    id: 'royal-maroon',
    name: 'Royal Maroon & Gold',
    maroon: '#5C1A2B',
    maroonDeep: '#3E1120',
    gold: '#C9962C',
    goldLight: '#E7C878',
    ivory: '#FBF3E7',
    teal: '#16413B',
    blush: '#E8B4B8',
    ink: '#2B1B1F',
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald & Champagne',
    maroon: '#133926',
    maroonDeep: '#0B2217',
    gold: '#D4AF37',
    goldLight: '#F3E5AB',
    ivory: '#F7F9F6',
    teal: '#1A4D32',
    blush: '#C2D6C7',
    ink: '#14211A',
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight & Rose Gold',
    maroon: '#101B39',
    maroonDeep: '#090F21',
    gold: '#E0A96D',
    goldLight: '#F4D6B6',
    ivory: '#F6F7FB',
    teal: '#1B2A4A',
    blush: '#E8B4B8',
    ink: '#101524',
  },
  {
    id: 'velvet-plum',
    name: 'Imperial Plum & Gold',
    maroon: '#4A154B',
    maroonDeep: '#2E0830',
    gold: '#CCA43B',
    goldLight: '#E5C973',
    ivory: '#FAF4F8',
    teal: '#2F1E3D',
    blush: '#E5B8E8',
    ink: '#261226',
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_priya_rahul',
    name: 'Priya & Rahul',
    email: 'priya.rahul@wedding.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'user_aarav',
    name: 'Aarav Sharma',
    email: 'aarav@celebrations.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  }
];

export const DEFAULT_RAHUL_PRIYA_CARD: InvitationCard = {
  id: 'card_rahul_priya',
  userId: 'user_priya_rahul',
  slug: 'rahul-and-priya-wedding',
  status: 'published',
  title: 'Rahul & Priya Wedding Ceremony & Reception',
  eventType: 'wedding',
  hosts: {
    person1: 'Priya',
    person2: 'Rahul',
    conjunction: '&',
    eyebrow: 'Together with their families',
    tagline: 'request the pleasure of your company at their wedding',
  },
  details: {
    dateLabel: '25 December 2026',
    isoDate: '2026-12-25T19:00:00',
    time: '7:00 PM',
    venue: 'Taj Krishna',
    city: 'Hyderabad, Telangana',
    mapQuery: 'Taj Krishna Hyderabad Telangana',
  },
  story: {
    enabled: true,
    eyebrow: 'Our Story',
    title: 'Two paths, one journey',
    content: `What began as a chance introduction at a mutual friend's gathering in Hyderabad slowly became long phone calls, shared playlists, and a hundred small reasons to see each other again. Three years, two families, and one very persistent monsoon later, Rahul and Priya are ready to begin the next chapter — and they would love for you to be there when it starts.`,
  },
  schedule: {
    enabled: true,
    eyebrow: 'Wedding Schedule',
    title: 'How the days unfold',
    items: [
      { id: 'sch_1', time: '24 Dec', title: 'Mehndi & Sangeet', desc: 'Family lawn, Taj Krishna — 5:00 PM onwards' },
      { id: 'sch_2', time: '25 Dec', title: 'Wedding Ceremony', desc: 'Main hall, Taj Krishna — 7:00 PM' },
      { id: 'sch_3', time: '25 Dec', title: 'Reception', desc: 'Grand ballroom, Taj Krishna — 9:00 PM' },
      { id: 'sch_4', time: '26 Dec', title: 'Farewell Brunch', desc: 'Poolside, Taj Krishna — 11:00 AM' },
    ],
  },
  gallery: {
    enabled: true,
    eyebrow: 'Gallery & Highlights',
    title: 'Moments so far',
    items: [
      {
        id: 'med_vid_1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'Engagement Ceremony Highlights',
        caption: 'A glimpse from our intimate ring ceremony in Udaipur',
        tall: true,
        videoType: 'url',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'med_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
        title: 'First Portrait',
        caption: 'Golden hour at Golconda Fort',
        tall: false
      },
      {
        id: 'med_2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
        title: 'Laughter',
        caption: 'Under the monsoon lights',
        tall: false
      },
      {
        id: 'med_3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
        title: 'Traditional Attire',
        caption: 'Pre-wedding festivities',
        tall: true
      },
      {
        id: 'med_4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
        title: 'Floral Decor',
        caption: 'Marigold and jasmine arches',
        tall: false
      },
      {
        id: 'med_5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=600&q=80',
        title: 'Celebrations',
        caption: 'Surrounded by loved ones',
        tall: false
      },
      {
        id: 'med_6',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
        title: 'Evening Sunset',
        caption: 'Twilight reflections',
        tall: true
      },
      {
        id: 'med_7',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
        title: 'Together Forever',
        caption: 'Hand in hand',
        tall: false
      }
    ],
  },
  venueSection: {
    enabled: true,
    eyebrow: 'Venue',
    title: 'Find your way to us',
    directionsText: 'Valet parking available at the main porch. For out-of-town guests, accommodation has been reserved at Taj Krishna.',
  },
  countdown: {
    enabled: true,
    eyebrow: 'Counting down',
    title: 'Until we say "I do"',
  },
  rsvp: {
    enabled: true,
    eyebrow: 'RSVP',
    title: 'Will you be there?',
    deadlineText: 'Kindly respond by 1st December 2026',
    acceptLabel: 'Joyfully Accept',
    declineLabel: 'Regretfully Decline',
  },
  footer: {
    signature: 'Rahul & Priya',
    fineText: 'Made with love · 25 December 2026 · Hyderabad',
  },
  theme: THEME_PRESETS[0],
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-09-11T10:00:00Z',
};

export const DEFAULT_AARAV_CARD: InvitationCard = {
  id: 'card_aarav_birthday',
  userId: 'user_aarav',
  slug: 'aarav-30th-birthday-gala',
  status: 'published',
  title: "Aarav's 30th Milestone Birthday Gala",
  eventType: 'birthday',
  hosts: {
    person1: 'Aarav Sharma',
    conjunction: '',
    eyebrow: 'Join the Celebration',
    tagline: 'invites you to toast to thirty years of memories, laughter, and new horizons',
  },
  details: {
    dateLabel: '18 October 2026',
    isoDate: '2026-10-18T20:00:00',
    time: '8:00 PM',
    venue: 'The Penthouse & Rooftop Lounge',
    city: 'Bandra West, Mumbai',
    mapQuery: 'Bandra West Mumbai Rooftop',
  },
  story: {
    enabled: true,
    eyebrow: 'The Milestone',
    title: 'Decade of adventures',
    content: 'Stepping into the fabulous thirties with the people who made the twenties unforgettable! An evening of artisan cocktails, skyline views, and endless dance beats.',
  },
  schedule: {
    enabled: true,
    eyebrow: 'Evening Schedule',
    title: 'Party Itinerary',
    items: [
      { id: 'sch_a1', time: '8:00 PM', title: 'Welcome Cocktails & Hors d’oeuvres', desc: 'Sunset Terrace' },
      { id: 'sch_a2', time: '9:30 PM', title: 'Toasts & Birthday Cake Ceremony', desc: 'Main Lounge' },
      { id: 'sch_a3', time: '10:30 PM', title: 'DJ & Afterhours Dancing', desc: 'Sky Dance Floor' },
    ],
  },
  gallery: {
    enabled: true,
    eyebrow: 'Snapshots',
    title: 'Throwbacks & Vibes',
    items: [
      {
        id: 'med_a1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        title: 'Cocktails',
        caption: 'Toast to 30!',
        tall: false
      },
      {
        id: 'med_a2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
        title: 'Party Atmosphere',
        caption: 'Night lights of Mumbai',
        tall: true
      },
      {
        id: 'med_a3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
        title: 'Good Times',
        caption: 'With best friends',
        tall: false
      }
    ],
  },
  venueSection: {
    enabled: true,
    eyebrow: 'Location',
    title: 'Party Venue',
    directionsText: 'Elevator to 28th floor. Dress code: Smart Chic / Glamour.',
  },
  countdown: {
    enabled: true,
    eyebrow: 'Countdown',
    title: 'To the big night',
  },
  rsvp: {
    enabled: true,
    eyebrow: 'Confirm Attendance',
    title: 'Are you in?',
    deadlineText: 'Please confirm by 10th October',
    acceptLabel: 'Count me in!',
    declineLabel: 'Can\'t make it',
  },
  footer: {
    signature: 'Aarav Sharma',
    fineText: 'Mumbai · 18 October 2026 · Party of the Year',
  },
  theme: THEME_PRESETS[1],
  createdAt: '2026-02-01T10:00:00Z',
  updatedAt: '2026-09-11T10:00:00Z',
};

const STORAGE_KEYS = {
  USERS: 'royal_invite_users',
  CURRENT_USER_ID: 'royal_invite_current_user_id',
  CARDS: 'royal_invite_cards',
  RSVPS: 'royal_invite_rsvps',
};

export const StorageService = {
  getUsers(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  },

  cacheUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser(): User | null {
    const users = this.getUsers();
    try {
      const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (!currentId) return null;
      const found = users.find((u) => u.id === currentId);
      if (found) return found;
    } catch {
      // ignore
    }
    return null;
  },

  getOrCreateGuestUser(): User {
    const existing = this.getCurrentUser();
    if (existing) return existing;

    const guestId = `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
    const guestUser: User = {
      id: guestId,
      name: 'Card Creator',
      email: `creator_${guestId.slice(-6)}@royalinvites.com`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    };
    this.cacheUser(guestUser);
    this.setCurrentUser(guestUser);
    return guestUser;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
      this.cacheUser(user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  },

  async loginUser(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const pass = password || 'password123';

    // 1. Try Firebase Authentication and Firestore users collection
    try {
      const fbResult = await FirebaseService.loginUser(cleanEmail, pass);
      if (fbResult.success && fbResult.user) {
        this.cacheUser(fbResult.user);
        this.setCurrentUser(fbResult.user);
        // Sync user's cards from Firestore in the background
        this.syncUserCardsFromCloud(fbResult.user.id).catch(console.warn);
        return fbResult;
      }
    } catch (fbError) {
      console.warn('Firebase login check had an issue, checking local storage:', fbError);
    }

    // 2. Fallback to local users list
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email. Please sign up.' };
    }

    if (user.password && user.password !== pass) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    this.setCurrentUser(user);
    // Sync user registration to Firebase in background so next time it's in cloud
    FirebaseService.registerUser(user.name, user.email, user.password).catch(console.warn);
    return { success: true, user };
  },

  async loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const fbResult = await FirebaseService.loginWithGoogle();
      if (fbResult.success && fbResult.user) {
        this.cacheUser(fbResult.user);
        this.setCurrentUser(fbResult.user);
        this.syncUserCardsFromCloud(fbResult.user.id).catch(console.warn);
      }
      return fbResult;
    } catch (e: any) {
      return { success: false, error: e?.message || 'Google sign-in error.' };
    }
  },

  logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    FirebaseService.logout().catch(console.warn);
  },

  async registerUser(name: string, email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const pass = password || 'password123';

    // 1. Register directly with Firebase Auth & persist to Firestore 'users'
    try {
      const fbResult = await FirebaseService.registerUser(cleanName, cleanEmail, pass);
      if (fbResult.success && fbResult.user) {
        this.cacheUser(fbResult.user);
        this.setCurrentUser(fbResult.user);
        return fbResult;
      }
      if (!fbResult.success) {
        return fbResult;
      }
    } catch (fbErr: any) {
      console.error('Firebase registration exception:', fbErr);
      return { success: false, error: fbErr?.message || 'Firebase authentication registration failed.' };
    }

    return { success: false, error: 'Registration could not be completed in Firebase.' };
  },

  getAllCards(): InvitationCard[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CARDS);
      if (stored) {
        const parsed: InvitationCard[] = JSON.parse(stored);
        // Hydrate themes with latest 3D metadata if available
        return parsed.map((c) => {
          const matchTheme = THEME_PRESETS.find((t) => t.id === c.theme?.id);
          if (matchTheme) {
            return {
              ...c,
              theme: {
                ...matchTheme,
                ...c.theme,
                bgImageUrl: matchTheme.bgImageUrl,
                is3D: matchTheme.is3D,
                archType: matchTheme.archType,
                particlesType: matchTheme.particlesType,
                glowColor: matchTheme.glowColor,
                ornamentStyle: matchTheme.ornamentStyle,
              },
            };
          }
          return c;
        });
      }
    } catch {
      // ignore
    }
    const defaults = [DEFAULT_RAHUL_PRIYA_CARD, DEFAULT_AARAV_CARD];
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(defaults));
    return defaults;
  },

  // USER ISOLATION: A user sees ONLY their data!
  getUserCards(userId: string): InvitationCard[] {
    const all = this.getAllCards();
    return all.filter((card) => card.userId === userId);
  },

  getCardById(cardId: string): InvitationCard | null {
    const all = this.getAllCards();
    return all.find((c) => c.id === cardId || c.slug === cardId) || null;
  },

  saveCard(card: InvitationCard, userId: string): InvitationCard {
    const all = this.getAllCards();
    const existingIndex = all.findIndex((c) => c.id === card.id);
    const updatedCard = {
      ...card,
      userId, // guarantee ownership
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // User can only overwrite their own card
      if (all[existingIndex].userId === userId) {
        all[existingIndex] = updatedCard;
      }
    } else {
      all.unshift(updatedCard);
    }

    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(all));

    // Persist to Firebase Firestore 'cards' collection
    FirebaseService.saveCard(updatedCard, userId).catch((err) => {
      console.warn('Firebase Firestore saveCard error:', err);
    });

    return updatedCard;
  },

  deleteCard(cardId: string, userId: string): boolean {
    const all = this.getAllCards();
    const filtered = all.filter((c) => !(c.id === cardId && c.userId === userId));
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(filtered));

    // Delete from Firebase Firestore
    FirebaseService.deleteCard(cardId).catch((err) => {
      console.warn('Firebase Firestore deleteCard error:', err);
    });

    return filtered.length !== all.length;
  },

  duplicateCard(cardId: string, userId: string): InvitationCard | null {
    const card = this.getCardById(cardId);
    if (!card) return null;
    const newCard: InvitationCard = {
      ...card,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      title: `${card.title} (Copy)`,
      slug: `${card.slug}-copy-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.saveCard(newCard, userId);
  },

  // Pull user's cards from Firebase Firestore and merge into local state
  async syncUserCardsFromCloud(userId: string): Promise<InvitationCard[]> {
    try {
      const cloudCards = await FirebaseService.getUserCards(userId);
      if (cloudCards.length > 0) {
        const all = this.getAllCards();
        cloudCards.forEach((cCard) => {
          const idx = all.findIndex((a) => a.id === cCard.id);
          if (idx >= 0) {
            all[idx] = cCard;
          } else {
            all.unshift(cCard);
          }
        });
        localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(all));
        return cloudCards;
      } else {
        // If user has local cards not yet in cloud, seed them to Firestore
        const localUserCards = this.getUserCards(userId);
        for (const lCard of localUserCards) {
          FirebaseService.saveCard(lCard, userId).catch(console.warn);
        }
      }
    } catch (e) {
      console.warn('Error syncing cards from Firebase:', e);
    }
    return this.getUserCards(userId);
  },

  // RSVPs
  getAllRSVPs(): RSVPResponse[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RSVPS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default initial seed RSVPs for Rahul & Priya
    const initialRSVPs: RSVPResponse[] = [
      {
        id: 'rsvp_1',
        cardId: 'card_rahul_priya',
        name: 'Anjali & Rohan Sharma',
        mobile: '98765 43210',
        status: 'yes',
        attendeesCount: 2,
        message: 'So thrilled for you both! Can’t wait for the Sangeet dance night!',
        createdAt: '2026-08-10T14:30:00Z',
      },
      {
        id: 'rsvp_2',
        cardId: 'card_rahul_priya',
        name: 'Vikram Kapoor',
        mobile: '98112 34567',
        status: 'yes',
        attendeesCount: 1,
        message: 'Heartiest congratulations to the lovely couple.',
        createdAt: '2026-08-14T09:15:00Z',
      },
      {
        id: 'rsvp_3',
        cardId: 'card_rahul_priya',
        name: 'Sunita & Deepak Roy',
        mobile: '99201 88231',
        status: 'no',
        attendeesCount: 0,
        message: 'Wishing you a lifetime of joy! Sadly overseas on work.',
        createdAt: '2026-08-18T18:00:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(initialRSVPs));
    return initialRSVPs;
  },

  getRSVPsForCard(cardId: string): RSVPResponse[] {
    const all = this.getAllRSVPs();
    return all.filter((r) => r.cardId === cardId);
  },

  saveRSVP(rsvp: Omit<RSVPResponse, 'id' | 'createdAt'>): RSVPResponse {
    const all = this.getAllRSVPs();
    const newRSVP: RSVPResponse = {
      ...rsvp,
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    all.push(newRSVP);
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(all));

    // Save to Firebase Firestore 'rsvps' collection
    FirebaseService.saveRSVP(newRSVP).catch((err) => {
      console.warn('Firebase Firestore saveRSVP error:', err);
    });

    return newRSVP;
  },

  /**
   * Pushes all local users, invitation cards, and RSVPs directly to Firebase Firestore
   * to ensure collections and documents exist in the Firebase Console.
   */
  async syncAllDataToFirestore(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      const users = this.getUsers();
      const cards = this.getAllCards();
      const rsvps = this.getAllRSVPs();
      const res = await FirebaseService.seedFirestoreWithDefaults(users, cards, rsvps);
      if (res.success) {
        return {
          success: true,
          message: `Successfully uploaded ${res.seededCount} records to Firebase Firestore!`,
          count: res.seededCount
        };
      }
      return { success: false, message: res.error || 'Failed to upload to Firebase.' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Sync error occurred.' };
    }
  },

  async syncCardRSVPsFromCloud(cardId: string): Promise<RSVPResponse[]> {
    try {
      const cloudRSVPs = await FirebaseService.getRSVPsForCard(cardId);
      if (cloudRSVPs.length > 0) {
        const all = this.getAllRSVPs();
        cloudRSVPs.forEach((cR) => {
          const idx = all.findIndex((r) => r.id === cR.id);
          if (idx >= 0) {
            all[idx] = cR;
          } else {
            all.push(cR);
          }
        });
        localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(all));
        return cloudRSVPs;
      }
    } catch (e) {
      console.warn('Error syncing RSVPs from cloud:', e);
    }
    return this.getRSVPsForCard(cardId);
  }
};
