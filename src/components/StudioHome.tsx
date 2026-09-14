import React from 'react';
import { 
  Sparkles, 
  Eye, 
  Palette, 
  Share2, 
  MapPin, 
  Users, 
  Film, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Heart,
  ShieldCheck,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { InvitationCard, User } from '../types';
import { THEME_PRESETS, DEFAULT_RAHUL_PRIYA_CARD, DEFAULT_AARAV_CARD, StorageService } from '../services/storage';

interface StudioHomeProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onStartCreate: (templateCardId?: string) => void;
  onViewDemo: (card: InvitationCard) => void;
  onGoToPortal: () => void;
}

export const StudioHome: React.FC<StudioHomeProps> = ({
  currentUser,
  onOpenAuth,
  onStartCreate,
  onViewDemo,
  onGoToPortal,
}) => {
  const templates = [
    {
      id: 'card_rahul_priya',
      title: 'Royal Maroon & Gold Wedding',
      eventType: 'Traditional Wedding & Reception',
      theme: THEME_PRESETS[0], // Royal Maroon
      description: 'Grand royal wedding theme with ornamental arches, paisley dividers, mehndi/sangeet schedule, and countdown timer.',
      tag: 'Most Popular',
      sampleCard: DEFAULT_RAHUL_PRIYA_CARD,
    },
    {
      id: 'card_aarav_birthday',
      title: 'Emerald & Champagne Gala',
      eventType: 'Milestone Birthday & Party',
      theme: THEME_PRESETS[1], // Emerald
      description: 'Sophisticated dark emerald aesthetic featuring cocktail hour, party itinerary, skyline views, and RSVP headcount tracking.',
      tag: 'Trending',
      sampleCard: DEFAULT_AARAV_CARD,
    },
    {
      id: 'template_midnight',
      title: 'Midnight Sapphire & Rose Gold',
      eventType: 'Sangeet Night & Modern Reception',
      theme: THEME_PRESETS[2], // Midnight Sapphire
      description: 'Stunning deep celestial blue with rose gold accents, photo/video highlights, and interactive venue navigation.',
      tag: 'Luxury',
      sampleCard: {
        ...DEFAULT_RAHUL_PRIYA_CARD,
        id: 'template_midnight_demo',
        title: 'Ananya & Kabir Sangeet & Reception',
        theme: THEME_PRESETS[2],
        hosts: {
          ...DEFAULT_RAHUL_PRIYA_CARD.hosts,
          person1: 'Ananya',
          person2: 'Kabir',
        }
      },
    },
    {
      id: 'template_plum',
      title: 'Imperial Plum & Gold',
      eventType: 'Anniversary & Intimate Gathering',
      theme: THEME_PRESETS[3], // Velvet Plum
      description: 'Rich velvet plum palette designed for silver/golden anniversaries and curated ceremonies with warm love stories.',
      tag: 'Elegant',
      sampleCard: {
        ...DEFAULT_RAHUL_PRIYA_CARD,
        id: 'template_plum_demo',
        title: 'Sunita & Vikram 25th Silver Jubilee',
        theme: THEME_PRESETS[3],
        hosts: {
          ...DEFAULT_RAHUL_PRIYA_CARD.hosts,
          person1: 'Sunita',
          person2: 'Vikram',
          tagline: 'request your blessings as they celebrate 25 years of love',
        }
      },
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-amber-900/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-stone-900 tracking-tight flex items-center gap-1.5">
              Royal Invite <span className="text-amber-700 font-sans text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-amber-100/80 rounded">Studio</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <button
              type="button"
              onClick={onGoToPortal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-stone-200"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="hidden sm:inline">My Cards</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-200/50 cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            onClick={onGoToPortal}
            className="text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-200/50 cursor-pointer hidden md:inline-block"
          >
            RSVPs Portal
          </button>
          
          <button
            type="button"
            onClick={() => onStartCreate()}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 hover:from-amber-600 hover:to-black shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Create Invitation</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-200/40 to-rose-200/30 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold mb-6 shadow-xs">
          <span>✨</span>
          <span>India’s Most Elegant Digital Invitation Platform</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-bold tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Create Luxury Digital Invitations{' '}
          <span className="italic font-normal text-amber-800 font-script text-5xl sm:text-6xl lg:text-7xl block sm:inline">
            for your special day
          </span>
        </h1>

        <p className="mt-6 text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Design interactive wedding, birthday, and celebration e-invitations with real-time RSVP tracking, photo & video highlights, Google Maps directions, and royal heritage themes.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => onStartCreate()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 hover:from-amber-600 hover:to-black shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Start Creating for Free</span>
          </button>

          <button
            type="button"
            onClick={() => onViewDemo(DEFAULT_RAHUL_PRIYA_CARD)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-700" />
            <span>View Live Demo Card</span>
          </button>
        </div>

        {/* Quick Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Instant WhatsApp Sharing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Real-time RSVP Tracking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>No App Download Required for Guests</span>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-14 bg-white/70 border-y border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-semibold tracking-widest text-amber-800 block mb-2">
              Royal Design Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Choose a Handcrafted Royal Template
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              Select any design below to customize names, venues, dates, photos, and music, or preview what your guests will see.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {templates.map((tpl) => (
              <div 
                key={tpl.id}
                className="group relative rounded-2xl overflow-hidden border border-stone-200/90 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Header Card Header with Theme Colors */}
                <div 
                  className="p-6 text-white relative overflow-hidden"
                  style={{ backgroundColor: tpl.theme.maroon }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-amber-200 border border-white/10">
                        {tpl.eventType}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold">
                        {tpl.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-amber-100">
                      {tpl.title}
                    </h3>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5 mt-4">
                      <div className="w-4 h-4 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: tpl.theme.maroon }} />
                      <div className="w-4 h-4 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: tpl.theme.gold }} />
                      <div className="w-4 h-4 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: tpl.theme.ivory }} />
                      <div className="w-4 h-4 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: tpl.theme.teal }} />
                      <span className="text-[11px] text-stone-300 ml-1.5">{tpl.theme.name}</span>
                    </div>
                  </div>

                  {/* Ornamental Overlay Motif in Header */}
                  <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full border-8 border-amber-300/10 pointer-events-none" />
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    {tpl.description}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => onStartCreate(tpl.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-stone-900 hover:bg-amber-900 transition-colors cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Use This Template</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewDemo(tpl.sampleCard)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-semibold tracking-widest text-amber-800 block mb-2">
            Effortless Creation
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            How to Create Your Invitation in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif text-xl font-bold mb-4">
              1
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
              Fill Event Details
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Enter host or couple names, ceremony dates, celebration schedule, and love story in our intuitive live editor.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif text-xl font-bold mb-4">
              2
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
              Add Media & Venue
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Upload photos, highlight videos, and set your Google Maps location so guests can get driving directions with 1 click.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif text-xl font-bold mb-4">
              3
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
              Share & Track RSVPs
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Send your private invitation link on WhatsApp. Receive instant RSVP confirmations, guest counts, and sweet messages.
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200 text-center">
            <Users className="w-6 h-6 text-amber-700 mx-auto mb-2" />
            <span className="font-bold text-stone-800 text-xs sm:text-sm block">RSVP Tracking</span>
            <span className="text-[11px] text-stone-500">Live headcounts</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 text-center">
            <MapPin className="w-6 h-6 text-amber-700 mx-auto mb-2" />
            <span className="font-bold text-stone-800 text-xs sm:text-sm block">Google Maps</span>
            <span className="text-[11px] text-stone-500">Easy GPS routing</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 text-center">
            <Film className="w-6 h-6 text-amber-700 mx-auto mb-2" />
            <span className="font-bold text-stone-800 text-xs sm:text-sm block">Video & Photos</span>
            <span className="text-[11px] text-stone-500">Interactive lightbox</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 text-center">
            <Smartphone className="w-6 h-6 text-amber-700 mx-auto mb-2" />
            <span className="font-bold text-stone-800 text-xs sm:text-sm block">Mobile First</span>
            <span className="text-[11px] text-stone-500">Works on all devices</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 px-4 sm:px-6 bg-stone-900 text-white text-center mt-auto">
        <div className="max-w-3xl mx-auto">
          <span className="text-amber-400 font-script text-3xl block mb-2">Celebrate with Grace</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
            Ready to design your wedding or celebration invitation?
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto mb-6">
            Get started in under 3 minutes. No credit card or installation required.
          </p>
          <button
            type="button"
            onClick={() => onStartCreate()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 hover:from-amber-300 hover:to-amber-500 shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Create Your Free Invitation</span>
          </button>
        </div>
      </section>

      {/* Studio Footer */}
      <footer className="bg-black text-stone-400 text-xs py-6 px-4 text-center border-t border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>© {new Date().getFullYear()} Royal Invite Studio · All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={onGoToPortal} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Creator Portal
            </button>
            <button 
              type="button" 
              onClick={onOpenAuth} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Account / Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
