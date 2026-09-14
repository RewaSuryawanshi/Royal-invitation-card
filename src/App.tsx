import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Eye, 
  Settings, 
  ArrowLeft, 
  Share2, 
  ExternalLink, 
  User, 
  Check, 
  Globe,
  Home
} from 'lucide-react';
import { User as UserType, InvitationCard } from './types';
import { StorageService, DEFAULT_RAHUL_PRIYA_CARD, DEFAULT_AARAV_CARD, THEME_PRESETS } from './services/storage';
import { FirebaseService } from './services/firebase';
import { ClientInvitation } from './components/ClientInvitation';
import { AdminPortal } from './components/AdminPortal';
import { CardEditor } from './components/CardEditor';
import { AuthModal } from './components/AuthModal';
import { StudioHome } from './components/StudioHome';

type AppView = 'home' | 'client' | 'admin' | 'editor' | 'preview_fullscreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => 
    StorageService.getCurrentUser()
  );
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'admin' || params.has('admin')) return 'admin';
    if (params.get('card')) return 'client';
    // Organic Google visitor without a card ID lands on the Studio Homepage!
    return 'home';
  });
  const [activeCardId, setActiveCardId] = useState<string>(() => {
    // Check URL query parameters for ?card=...
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get('card');
    if (cardParam) return cardParam;
    return DEFAULT_RAHUL_PRIYA_CARD.id;
  });

  const [activeCard, setActiveCard] = useState<InvitationCard>(() => {
    return StorageService.getCardById(activeCardId) || DEFAULT_RAHUL_PRIYA_CARD;
  });

  const [editingCard, setEditingCard] = useState<InvitationCard | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync activeCard if activeCardId changes (checking local cache first, then Firestore)
  useEffect(() => {
    const card = StorageService.getCardById(activeCardId);
    if (card) {
      setActiveCard(card);
    } else {
      // Check Firebase Firestore for newly created or shared invitation links
      FirebaseService.getCardById(activeCardId).then((cloudCard) => {
        if (cloudCard) {
          StorageService.saveCard(cloudCard, cloudCard.userId);
          setActiveCard(cloudCard);
        }
      }).catch(console.warn);
    }
  }, [activeCardId]);

  // Sync user's cloud cards on launch if signed in
  useEffect(() => {
    if (currentUser) {
      StorageService.syncUserCardsFromCloud(currentUser.id).catch(console.warn);
    }
  }, [currentUser]);

  // Push default sample cards, accounts & RSVPs to Firebase Firestore on start
  useEffect(() => {
    StorageService.syncAllDataToFirestore().catch(console.warn);
  }, []);

  // Handle URL change listeners
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cardParam = params.get('card');
      const viewParam = params.get('view');
      if (viewParam === 'admin' || params.has('admin')) {
        setCurrentView('admin');
      } else if (cardParam) {
        setActiveCardId(cardParam);
        setCurrentView('client');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handlers
  const handleSwitchView = (view: AppView) => {
    if (view === 'admin' && !currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView(view);
    if (view === 'admin') {
      const newUrl = `${window.location.pathname}?view=admin`;
      window.history.pushState({ view: 'admin' }, '', newUrl);
    } else if (view === 'client') {
      const newUrl = `${window.location.pathname}?card=${activeCard.id}`;
      window.history.pushState({ cardId: activeCard.id }, '', newUrl);
    } else if (view === 'home') {
      const newUrl = window.location.pathname;
      window.history.pushState({ view: 'home' }, '', newUrl);
    }
  };

  const handleStartCreateFromHome = (templateId?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    let baseCard: InvitationCard = DEFAULT_RAHUL_PRIYA_CARD;
    if (templateId === 'card_aarav_birthday') {
      baseCard = DEFAULT_AARAV_CARD;
    } else if (templateId === 'template_midnight') {
      baseCard = {
        ...DEFAULT_RAHUL_PRIYA_CARD,
        theme: THEME_PRESETS[2],
        title: `${currentUser.name}'s Sangeet & Reception`,
        hosts: {
          ...DEFAULT_RAHUL_PRIYA_CARD.hosts,
          person1: currentUser.name.split(' ')[0] || 'Host',
          person2: 'Partner',
        }
      };
    } else if (templateId === 'template_plum') {
      baseCard = {
        ...DEFAULT_RAHUL_PRIYA_CARD,
        theme: THEME_PRESETS[3],
        title: `${currentUser.name}'s Silver Jubilee Celebration`,
        hosts: {
          ...DEFAULT_RAHUL_PRIYA_CARD.hosts,
          person1: currentUser.name,
          person2: '',
          tagline: 'cordially invites you to celebrate together',
        }
      };
    }

    // Create fresh draft card owned by currentUser
    const newCard: InvitationCard = {
      ...baseCard,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: currentUser.id,
      title: `${currentUser.name}'s Invitation`,
      slug: `invitation-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = StorageService.saveCard(newCard, currentUser.id);
    setEditingCard(saved);
    setActiveCard(saved);
    setActiveCardId(saved.id);
    setCurrentView('editor');
  };

  const handleViewCard = (card: InvitationCard) => {
    setActiveCard(card);
    setActiveCardId(card.id);
    setCurrentView('client');
    // Update URL query without full reload
    const newUrl = `${window.location.pathname}?card=${card.id}`;
    window.history.pushState({ cardId: card.id }, '', newUrl);
  };

  const handleEditCard = (card: InvitationCard) => {
    if (!currentUser || card.userId !== currentUser.id) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingCard(card);
    setCurrentView('editor');
  };

  const handleSaveCard = (savedCard: InvitationCard) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const updated = StorageService.saveCard(savedCard, currentUser.id);
    setEditingCard(updated);
    setActiveCard(updated);
  };

  const handleUserChanged = (newUser: UserType | null) => {
    setCurrentUser(newUser);
    if (newUser) {
      // If user logs in, show their own cards in active card
      const userCards = StorageService.getUserCards(newUser.id);
      if (userCards.length > 0) {
        setActiveCard(userCards[0]);
        setActiveCardId(userCards[0].id);
      }
    } else {
      // User logged out
      if (currentView === 'admin' || currentView === 'editor') {
        setCurrentView('home');
      }
    }
  };

  const isCurrentCardOwner = !!currentUser && activeCard.userId === currentUser.id;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Global Top Switcher Bar (Visible in Client & Preview modes to easily toggle between Client View, Studio Home & Admin Portal) */}
      {(currentView === 'client' || currentView === 'preview_fullscreen') && (
        <div className="bg-stone-900/95 backdrop-blur-md text-stone-200 border-b border-stone-800 px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleSwitchView('home')}
              className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <span>👑</span>
              <span>Royal Invite</span>
            </button>

            <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700">
              <button
                type="button"
                onClick={() => handleSwitchView('home')}
                className="px-2.5 py-1 rounded-md font-medium text-stone-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                title="Return to Studio Home"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Studio Home</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchView('client')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'client'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Client View</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchView('admin')}
                className="px-3 py-1 rounded-md font-medium text-stone-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
                title="Account Details"
              >
                <User className="w-3 h-3 text-amber-400" />
                <span className="truncate max-w-[100px]">{currentUser.name}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors cursor-pointer text-xs"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <StudioHome
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onStartCreate={handleStartCreateFromHome}
            onViewDemo={handleViewCard}
            onGoToPortal={() => handleSwitchView('admin')}
          />
        )}

        {currentView === 'client' && (
          <ClientInvitation
            card={activeCard}
            onEdit={isCurrentCardOwner ? () => handleEditCard(activeCard) : undefined}
            onGoToAdmin={isCurrentCardOwner ? () => handleSwitchView('admin') : undefined}
            isOwner={isCurrentCardOwner}
          />
        )}

        {currentView === 'admin' && (
          currentUser ? (
            <AdminPortal
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onViewCard={handleViewCard}
              onEditCard={handleEditCard}
            />
          ) : (
            <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-stone-200">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mx-auto mb-4">
                  <User className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Creator Portal Sign In</h2>
                <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                  Your event invitations, RSVP headcounts, and guest lists are strictly private. Please sign in with your email and password to access your dashboard.
                </p>
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
                  >
                    Sign In with Email & Password
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchView('home')}
                    className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    Back to Studio Home
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {currentView === 'editor' && editingCard && (
          <CardEditor
            initialCard={editingCard}
            onSave={handleSaveCard}
            onCancel={() => setCurrentView('admin')}
            onPreviewFull={(cardToPreview) => {
              setActiveCard(cardToPreview);
              setCurrentView('preview_fullscreen');
            }}
          />
        )}

        {currentView === 'preview_fullscreen' && (
          <div className="relative">
            {/* Floating button to return to editor */}
            <div className="fixed bottom-6 left-6 z-50">
              <button
                type="button"
                onClick={() => setCurrentView('editor')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900/90 hover:bg-black text-white shadow-2xl backdrop-blur-md border border-amber-400/40 text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Back to Editor</span>
              </button>
            </div>
            <ClientInvitation card={activeCard} />
          </div>
        )}
      </div>

      {/* User Authentication & Demo Account Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={handleUserChanged}
      />
    </div>
  );
}
