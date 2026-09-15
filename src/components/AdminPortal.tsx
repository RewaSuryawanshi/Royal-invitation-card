import React, { useState } from 'react';
import { 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Copy, 
  Share2, 
  Users, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ExternalLink,
  Shield,
  LogOut,
  UserCheck,
  FileSpreadsheet,
  Download,
  AlertCircle,
  ImagePlus,
  Image as ImageIcon
} from 'lucide-react';
import { User, InvitationCard, RSVPResponse } from '../types';
import { StorageService, THEME_PRESETS, DEFAULT_RAHUL_PRIYA_CARD } from '../services/storage';
import { FirebaseService } from '../services/firebase';

interface AdminPortalProps {
  currentUser: User;
  onOpenAuth: () => void;
  onViewCard: (card: InvitationCard) => void;
  onEditCard: (card: InvitationCard, initialTab?: 'details' | 'story' | 'schedule' | 'media' | 'theme' | 'rsvp' | 'preview') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onOpenAuth,
  onViewCard,
  onEditCard,
}) => {
  // STRICT USER DATA ISOLATION:
  // "on the portal they will see only their data, not others' data"
  const [userCards, setUserCards] = useState<InvitationCard[]>(() => 
    StorageService.getUserCards(currentUser.id)
  );
  const [selectedRsvpCard, setSelectedRsvpCard] = useState<InvitationCard | null>(null);
  const [cardRsvps, setCardRsvps] = useState<RSVPResponse[]>([]);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'wedding' | 'birthday' | 'anniversary' | 'gala' | 'party' | 'other'>('wedding');
  const [newPerson1, setNewPerson1] = useState('');
  const [newPerson2, setNewPerson2] = useState('');
  const [createDestinationTab, setCreateDestinationTab] = useState<'details' | 'media'>('details');
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [syncStatusNotice, setSyncStatusNotice] = useState<string | null>(null);

  const handleSyncToFirebase = async () => {
    setIsSyncingFirebase(true);
    setSyncStatusNotice('Uploading cards, users & RSVPs to Firebase Firestore...');
    try {
      const res = await StorageService.syncAllDataToFirestore();
      setSyncStatusNotice(res.message);
      // Refresh cards
      setUserCards(StorageService.getUserCards(currentUser.id));
      setTimeout(() => setSyncStatusNotice(null), 5000);
    } catch (e: any) {
      setSyncStatusNotice('Sync error: ' + (e?.message || 'Failed'));
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  // Reload cards whenever currentUser changes and sync with Firebase in real time
  React.useEffect(() => {
    setUserCards(StorageService.getUserCards(currentUser.id));

    // Connect real-time snapshot listener to Firestore 'cards'
    const unsubscribe = FirebaseService.subscribeToUserCards(currentUser.id, (liveCards) => {
      if (liveCards && liveCards.length > 0) {
        setUserCards(liveCards);
      }
    });

    // Initial cloud fetch & sync
    StorageService.syncUserCardsFromCloud(currentUser.id).then((cloudCards) => {
      if (cloudCards && cloudCards.length > 0) {
        setUserCards(cloudCards);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser.id]);

  // Real-time live RSVP subscription from Firebase Firestore
  React.useEffect(() => {
    if (!selectedRsvpCard) return;

    // Load initial cached RSVPs immediately
    setCardRsvps(StorageService.getRSVPsForCard(selectedRsvpCard.id));

    // Connect real-time snapshot listener to Firestore
    const unsubscribe = FirebaseService.subscribeToRSVPs(selectedRsvpCard.id, (liveRsvps) => {
      if (liveRsvps && liveRsvps.length >= 0) {
        setCardRsvps(liveRsvps);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedRsvpCard]);

  // Open RSVP inspector
  const handleOpenRsvps = (card: InvitationCard) => {
    setSelectedRsvpCard(card);
  };

  const handleCopyLink = (card: InvitationCard) => {
    const url = `${window.location.origin}${window.location.pathname}?card=${card.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCardId(card.id);
      setTimeout(() => setCopiedCardId(null), 2500);
    });
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this invitation card?')) {
      StorageService.deleteCard(cardId, currentUser.id);
      setUserCards(StorageService.getUserCards(currentUser.id));
    }
  };

  const handleDuplicate = (cardId: string) => {
    const duplicated = StorageService.duplicateCard(cardId, currentUser.id);
    if (duplicated) {
      setUserCards(StorageService.getUserCards(currentUser.id));
    }
  };

  // Create new card
  const handleCreateNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson1.trim()) return;

    const baseCard: InvitationCard = {
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: currentUser.id,
      slug: `${newPerson1.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      status: 'published',
      title: newTitle.trim() || `${newPerson1}'s Celebration`,
      eventType: newEventType,
      hosts: {
        person1: newPerson1.trim(),
        person2: newPerson2.trim() || undefined,
        conjunction: newPerson2.trim() ? '&' : '',
        eyebrow: newEventType === 'wedding' ? 'Together with their families' : 'You are cordially invited',
        tagline: newEventType === 'wedding'
          ? 'request the pleasure of your company at their wedding'
          : 'invites you to celebrate this special milestone',
      },
      details: {
        dateLabel: '15 December 2026',
        isoDate: '2026-12-15T19:00:00',
        time: '7:00 PM',
        venue: 'Grand Heritage Palace',
        city: 'New Delhi, India',
        mapQuery: 'Grand Heritage Palace New Delhi',
      },
      story: {
        enabled: true,
        eyebrow: 'Our Story',
        title: 'A Beautiful Beginning',
        content: 'We are overjoyed to invite you to celebrate this milestone with us. Your love, laughter, and presence will make our celebration complete.',
      },
      schedule: {
        enabled: true,
        eyebrow: 'Event Schedule',
        title: 'Celebration Timeline',
        items: [
          { id: 'sch_1', time: '6:30 PM', title: 'Welcome & Refreshments', desc: 'Courtyard Lawn' },
          { id: 'sch_2', time: '7:30 PM', title: 'Ceremony / Main Event', desc: 'Grand Ballroom' },
          { id: 'sch_3', time: '9:00 PM', title: 'Banquet Dinner & Music', desc: 'Dining Pavilion' },
        ],
      },
      gallery: {
        enabled: true,
        eyebrow: 'Moments & Highlights',
        title: 'Memories & Celebrations',
        items: [
          {
            id: 'med_c1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
            title: 'Joyful Moments',
            caption: 'Together with family and friends',
            tall: true,
          },
          {
            id: 'med_c2',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
            title: 'Celebration Decor',
            caption: 'Warm lights and flowers',
            tall: false,
          },
          {
            id: 'med_c3',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            title: 'Ceremony Preview Video',
            caption: 'A heartfelt teaser video',
            tall: false,
            videoType: 'url',
            thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
          }
        ],
      },
      venueSection: {
        enabled: true,
        eyebrow: 'Venue',
        title: 'Find your way to us',
        directionsText: 'Valet parking available at the main gate.',
      },
      countdown: {
        enabled: true,
        eyebrow: 'Counting down',
        title: 'Until the celebration',
      },
      rsvp: {
        enabled: true,
        eyebrow: 'RSVP',
        title: 'Will you join us?',
        deadlineText: 'Kindly respond by 1st December 2026',
        acceptLabel: 'Joyfully Accept',
        declineLabel: 'Regretfully Decline',
      },
      footer: {
        signature: newPerson2.trim() ? `${newPerson1} & ${newPerson2}` : newPerson1,
        fineText: 'Made with love · 2026',
      },
      theme: THEME_PRESETS[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = StorageService.saveCard(baseCard, currentUser.id);
    setUserCards(StorageService.getUserCards(currentUser.id));
    setShowCreateModal(false);
    setNewTitle('');
    setNewPerson1('');
    setNewPerson2('');
    onEditCard(saved, createDestinationTab);
  };

  // Aggregate stats across all cards owned by this user
  const totalRsvps = userCards.reduce((acc, c) => acc + StorageService.getRSVPsForCard(c.id).length, 0);
  const totalAttending = userCards.reduce((acc, c) => {
    const list = StorageService.getRSVPsForCard(c.id);
    return acc + list.filter(r => r.status === 'yes').reduce((sum, r) => sum + (r.attendeesCount || 1), 0);
  }, 0);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-16">
      {/* Top Banner & Header */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-serif font-bold text-lg shadow-sm">
              👑
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-tight text-white leading-tight">
                Invitation Card Creator Portal
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-amber-300/90">
                <Shield className="w-3.5 h-3.5" />
                <span>Isolated Portal Account</span>
              </div>
            </div>
          </div>

          {/* User Profile & Account Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSyncToFirebase}
              disabled={isSyncingFirebase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-amber-950/80 border border-amber-500/40 text-[11px] text-amber-200 transition-all cursor-pointer disabled:opacity-50"
              title="Push cards & RSVPs directly to your Firebase Firestore database"
            >
              <span className={`w-2 h-2 rounded-full ${isSyncingFirebase ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{isSyncingFirebase ? 'Syncing to Firebase...' : 'Push to Firestore'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs text-stone-200 transition-all cursor-pointer group"
              title="View Account Details"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-amber-400/50"
              />
              <span className="font-medium group-hover:text-amber-300 transition-colors">
                {currentUser.name}
              </span>
              <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded">
                My Account
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                StorageService.logoutUser();
                onOpenAuth();
              }}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950/60 hover:text-rose-300 text-stone-400 border border-stone-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {syncStatusNotice && (
          <div className="p-3.5 rounded-xl bg-stone-900 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{syncStatusNotice}</span>
            </div>
            <button
              onClick={() => setSyncStatusNotice(null)}
              className="text-stone-400 hover:text-white text-xs px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* User Isolation Notice */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
          <UserCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-amber-900 text-sm">
              Strict User-Isolated Portal: {currentUser.name} ({currentUser.email})
            </div>
            <p className="text-amber-800/90 mt-0.5 leading-relaxed">
              Your account is completely private. You only see the invitation cards and guest RSVPs you created. No other user can view or alter your events. To access a different account, sign out and enter that account's email and password.
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
              Your Cards
            </div>
            <div className="font-serif text-3xl font-bold text-stone-900">
              {userCards.length}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Active invitations in your portal
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
              Total RSVPs Received
            </div>
            <div className="font-serif text-3xl font-bold text-amber-700">
              {totalRsvps}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Guest responses across cards
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
              Attending Guests
            </div>
            <div className="font-serif text-3xl font-bold text-emerald-700">
              {totalAttending}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Confirmed attendees (+1s)
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
              Dynamic Media
            </div>
            <div className="font-serif text-3xl font-bold text-stone-800">
              {userCards.reduce((acc, c) => acc + c.gallery.items.length, 0)}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Photos & videos displayed
            </div>
          </div>
        </div>

        {/* Section Header & Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Your Invitation Cards
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage your dynamic event cards, media, and real-time RSVPs
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Invitation Card</span>
          </button>
        </div>

        {/* Cards Grid */}
        {userCards.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl">
              💌
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">No invitations created yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                You have not created any invitation cards in this account yet. Click below to craft your first dynamic invitation!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-md hover:bg-amber-700 transition-colors cursor-pointer"
            >
              Create My First Invitation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCards.map((card) => {
              const rsvps = StorageService.getRSVPsForCard(card.id);
              const accepted = rsvps.filter((r) => r.status === 'yes').length;
              const isCopied = copiedCardId === card.id;

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Card Header Preview Banner */}
                  <div
                    className="p-5 text-white relative overflow-hidden"
                    style={{
                      background: `radial-gradient(120% 90% at 50% 0%, ${card.theme.maroon} 0%, ${card.theme.maroonDeep} 80%)`,
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="uppercase tracking-widest font-medium opacity-80" style={{ color: card.theme.goldLight }}>
                        {card.eventType}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        card.status === 'published' ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40' : 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                      }`}>
                        {card.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-semibold leading-tight text-white mb-1">
                      {card.hosts.person1}
                      {card.hosts.person2 && ` & ${card.hosts.person2}`}
                    </h3>

                    <div className="text-xs text-amber-100/75 line-clamp-1">
                      {card.title}
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-300/20 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-amber-200">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{card.details.dateLabel}</span>
                      </span>
                      <span className="flex items-center gap-1 text-amber-200/80 truncate max-w-[150px]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{card.details.venue}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body & Dynamic Stats */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>RSVP Responses</span>
                        </span>
                        <span className="font-semibold text-stone-900">
                          {rsvps.length} total ({accepted} attending)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span className="flex items-center gap-1 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                          <span>Gallery Media</span>
                        </span>
                        <span className="text-stone-700">
                          {card.gallery.items.length} items ({card.gallery.items.filter(m => m.type === 'video').length} videos)
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onViewCard(card)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditCard(card)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Card</span>
                        </button>
                      </div>

                      {/* Direct Upload Photos & Videos Button */}
                      <button
                        type="button"
                        onClick={() => onEditCard(card, 'media')}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        title="Direct shortcut to upload photos and videos to this card"
                      >
                        <ImagePlus className="w-3.5 h-3.5 text-amber-600" />
                        <span>Upload Photos & Videos ({card.gallery?.items?.length || 0})</span>
                      </button>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => handleOpenRsvps(card)}
                          className="text-stone-600 hover:text-amber-700 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Guest RSVPs ({rsvps.length})</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(card)}
                            className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                            title={isCopied ? 'Link Copied!' : 'Copy Share Link'}
                          >
                            {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicate(card.id)}
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                            title="Duplicate Card"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                            title="Delete Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ================= CREATE NEW CARD MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Create New Invitation Card
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enter basic host info. You can customize photos, videos, and schedule next!
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer text-lg font-light"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Event Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wedding', label: 'Wedding' },
                    { id: 'birthday', label: 'Birthday' },
                    { id: 'anniversary', label: 'Anniversary' },
                    { id: 'gala', label: 'Gala / Soirée' },
                    { id: 'party', label: 'Party' },
                    { id: 'other', label: 'Other Event' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewEventType(cat.id as any)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        newEventType === cat.id
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Invitation / Card Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya & Kabir Wedding Ceremony"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary Host / Bride *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya"
                    value={newPerson1}
                    onChange={(e) => setNewPerson1(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Partner / Groom (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kabir"
                    value={newPerson2}
                    onChange={(e) => setNewPerson2(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPerson1.trim()}
                  onClick={() => setCreateDestinationTab('media')}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 disabled:opacity-50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Create card and immediately open the Photo & Video upload studio"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-amber-800" />
                  <span>Create & Upload Photos</span>
                </button>

                <button
                  type="submit"
                  disabled={!newPerson1.trim()}
                  onClick={() => setCreateDestinationTab('details')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  Create & Edit Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RSVP INSPECTOR DRAWER / MODAL ================= */}
      {selectedRsvpCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Guest RSVPs: {selectedRsvpCard.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time responses submitted by guests on your client-side invitation card
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRsvpCard(null)}
                className="text-stone-400 hover:text-stone-600 p-1 text-lg font-light cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Table / List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {cardRsvps.length === 0 ? (
                <div className="text-center py-12 text-stone-500 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto text-stone-400" />
                  <p className="text-sm">No RSVPs received yet for this invitation.</p>
                  <p className="text-xs text-stone-400">Share your live link with friends and family!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                    <span>Showing {cardRsvps.length} responses</span>
                    <span className="font-semibold text-emerald-700">
                      {cardRsvps.filter(r => r.status === 'yes').length} Attending · {cardRsvps.filter(r => r.status === 'no').length} Declined
                    </span>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {cardRsvps.map((rsvp) => (
                      <div key={rsvp.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-stone-900 text-sm">{rsvp.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              rsvp.status === 'yes'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {rsvp.status === 'yes' ? 'Attending' : 'Declined'}
                            </span>
                            {rsvp.attendeesCount && rsvp.attendeesCount > 1 && (
                              <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                +{rsvp.attendeesCount - 1} guests
                              </span>
                            )}
                          </div>
                          {rsvp.mobile && (
                            <div className="text-xs text-stone-500 mt-0.5">
                              📞 {rsvp.mobile}
                            </div>
                          )}
                          {rsvp.message && (
                            <p className="text-xs text-stone-600 italic mt-1 bg-stone-50 p-2 rounded">
                              "{rsvp.message}"
                            </p>
                          )}
                        </div>

                        <div className="text-[11px] text-stone-400 whitespace-nowrap self-start sm:self-center">
                          {new Date(rsvp.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRsvpCard(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
