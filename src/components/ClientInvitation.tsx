import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Play, 
  Image as ImageIcon, 
  Heart, 
  CheckCircle2, 
  Share2, 
  Edit3, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { InvitationCard, MediaItem, RSVPResponse } from '../types';
import { OrnamentalDivider, CornerMotif, RoyalTitleCrest } from './OrnamentalElements';
import { LightboxModal } from './LightboxModal';
import { StorageService } from '../services/storage';

interface ClientInvitationProps {
  card: InvitationCard;
  onEdit?: () => void;
  onGoToAdmin?: () => void;
  onOpenAuth?: () => void;
  onGoHome?: () => void;
  isOwner?: boolean;
}

export const ClientInvitation: React.FC<ClientInvitationProps> = ({
  card,
  onEdit,
  onGoToAdmin,
  onOpenAuth,
  onGoHome,
  isOwner = false,
}) => {
  const { theme } = card;

  // Dynamically update document title with event/couple name and title icon
  useEffect(() => {
    const originalTitle = document.title;
    const coupleName = card.hosts.person2 
      ? `${card.hosts.person1} & ${card.hosts.person2}`
      : card.hosts.person1;
    document.title = `${coupleName} | ${card.title || 'Wedding & Celebration Invitation'}`;
    return () => {
      document.title = originalTitle;
    };
  }, [card.title, card.hosts.person1, card.hosts.person2]);

  // Media lightbox state
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');

  // RSVP Form State
  const [guestName, setGuestName] = useState('');
  const [guestMobile, setGuestMobile] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no' | null>(null);
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [guestMessage, setGuestMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpsList, setRsvpsList] = useState<RSVPResponse[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load RSVPs for this card
  useEffect(() => {
    const list = StorageService.getRSVPsForCard(card.id);
    setRsvpsList(list);
  }, [card.id]);

  // Countdown calculations
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(card.details.isoDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(card.details.isoDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [card.details.isoDate]);

  function calculateTimeLeft(targetDateStr: string) {
    const difference = Math.max(0, new Date(targetDateStr).getTime() - Date.now());
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !rsvpStatus) return;

    const newRsvp = StorageService.saveRSVP({
      cardId: card.id,
      name: guestName.trim(),
      mobile: guestMobile.trim(),
      status: rsvpStatus,
      attendeesCount: rsvpStatus === 'yes' ? attendeesCount : 0,
      message: guestMessage.trim(),
    });

    setRsvpsList((prev) => [...prev, newRsvp]);
    setRsvpSubmitted(true);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?card=${card.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const acceptedCount = rsvpsList.filter((r) => r.status === 'yes').length;
  const declinedCount = rsvpsList.filter((r) => r.status === 'no').length;

  const filteredMedia = card.gallery.items.filter((item) => {
    if (mediaFilter === 'all') return true;
    return item.type === mediaFilter;
  });

  const hasVideos = card.gallery.items.some((m) => m.type === 'video');

  const mapQuery = encodeURIComponent(
    card.details.mapQuery || `${card.details.venue} ${card.details.city}`
  );

  return (
    <div 
      className="min-h-screen font-sans selection:bg-amber-200 selection:text-stone-900 transition-colors duration-500 relative"
      style={{
        backgroundColor: theme.ivory,
        color: theme.ink,
      }}
    >
      {/* Floating Top Bar for Quick Actions - Clean guest experience */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md shadow-lg transition-all border cursor-pointer hover:scale-105"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            color: theme.maroonDeep,
            borderColor: `${theme.gold}40`,
          }}
          title="Copy Invitation Link"
        >
          {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-amber-600" />}
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>

        {isOwner && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: theme.maroon,
              border: `1px solid ${theme.goldLight}`,
            }}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-300" />
            <span>Edit Card</span>
          </button>
        )}

        {isOwner && onGoToAdmin && (
          <button
            type="button"
            onClick={onGoToAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-lg transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: theme.gold,
              color: theme.maroonDeep,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        )}
      </div>

      {/* ================= HERO SECTION ================= */}
      <section 
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${theme.maroon} 0%, ${theme.maroonDeep} 80%)`,
          color: theme.ivory,
        }}
      >
        {/* Ornamental Corners */}
        <div className="absolute top-6 left-6 pointer-events-none">
          <CornerMotif color={theme.goldLight} />
        </div>
        <div className="absolute top-6 right-6 pointer-events-none -scale-x-100">
          <CornerMotif color={theme.goldLight} />
        </div>
        <div className="absolute bottom-6 left-6 pointer-events-none -scale-y-100">
          <CornerMotif color={theme.goldLight} />
        </div>
        <div className="absolute bottom-6 right-6 pointer-events-none -scale-100">
          <CornerMotif color={theme.goldLight} />
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto z-10 flex flex-col items-center">
          {/* Royal Title Crest Emblem (Golden Crown & Laurels) */}
          <RoyalTitleCrest 
            color={theme.gold} 
            accentColor={theme.goldLight} 
            size={60} 
            className="mb-3 animate-in fade-in zoom-in duration-700" 
          />

          {card.hosts.eyebrow && (
            <span 
              className="text-xs uppercase tracking-[0.35em] font-medium mb-4"
              style={{ color: theme.gold }}
            >
              {card.hosts.eyebrow}
            </span>
          )}

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-tight my-2 font-normal">
            {card.hosts.person1}
            {card.hosts.person2 && (
              <>
                {' '}
                <span 
                  className="font-script text-[0.8em] font-normal px-1.5 align-middle"
                  style={{ color: theme.gold }}
                >
                  {card.hosts.conjunction || '&'}
                </span>{' '}
                {card.hosts.person2}
              </>
            )}
          </h1>

          {card.hosts.tagline && (
            <p 
              className="text-sm sm:text-base tracking-wide max-w-xl mx-auto my-5 leading-relaxed font-light"
              style={{ color: theme.blush }}
            >
              {card.hosts.tagline}
            </p>
          )}

          {/* Details Bar */}
          <div 
            className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 py-5 px-6 my-6 border-y max-w-2xl w-full"
            style={{ borderColor: `${theme.goldLight}40` }}
          >
            <div className="text-center">
              <div 
                className="text-[10px] tracking-[0.25em] uppercase font-medium mb-1 flex items-center justify-center gap-1.5"
                style={{ color: theme.goldLight }}
              >
                <Calendar className="w-3 h-3" />
                <span>Date</span>
              </div>
              <div className="font-serif text-lg sm:text-xl font-medium">{card.details.dateLabel}</div>
            </div>

            <div className="w-[1px] h-8 bg-amber-200/20 hidden sm:block" />

            <div className="text-center">
              <div 
                className="text-[10px] tracking-[0.25em] uppercase font-medium mb-1 flex items-center justify-center gap-1.5"
                style={{ color: theme.goldLight }}
              >
                <Clock className="w-3 h-3" />
                <span>Time</span>
              </div>
              <div className="font-serif text-lg sm:text-xl font-medium">{card.details.time}</div>
            </div>

            <div className="w-[1px] h-8 bg-amber-200/20 hidden sm:block" />

            <div className="text-center">
              <div 
                className="text-[10px] tracking-[0.25em] uppercase font-medium mb-1 flex items-center justify-center gap-1.5"
                style={{ color: theme.goldLight }}
              >
                <MapPin className="w-3 h-3" />
                <span>Venue</span>
              </div>
              <div className="font-serif text-lg sm:text-xl font-medium">{card.details.venue}</div>
            </div>
          </div>

          <div 
            className="mt-8 text-xs uppercase tracking-[0.25em] flex flex-col items-center gap-2 animate-bounce font-light"
            style={{ color: theme.goldLight }}
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      {card.story.enabled && (
        <section className="py-20 px-6 sm:px-12 max-w-3xl mx-auto text-center">
          <span 
            className="text-xs uppercase tracking-[0.35em] font-medium"
            style={{ color: theme.gold }}
          >
            {card.story.eyebrow}
          </span>
          <h2 
            className="font-serif text-3xl sm:text-4xl italic my-4"
            style={{ color: theme.maroon }}
          >
            {card.story.title}
          </h2>
          <div 
            className="text-base sm:text-lg leading-relaxed whitespace-pre-line my-6 max-w-2xl mx-auto font-light"
            style={{ color: theme.ink }}
          >
            {card.story.content}
          </div>
          <OrnamentalDivider color={theme.gold} />
        </section>
      )}

      {/* ================= SCHEDULE / TIMELINE ================= */}
      {card.schedule.enabled && card.schedule.items.length > 0 && (
        <section 
          className="py-20 px-6 sm:px-12 text-center"
          style={{
            backgroundColor: theme.maroon,
            color: theme.ivory,
          }}
        >
          <div className="max-w-2xl mx-auto">
            <span 
              className="text-xs uppercase tracking-[0.35em] font-medium block"
              style={{ color: theme.gold }}
            >
              {card.schedule.eyebrow}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl italic mt-3 mb-12">
              {card.schedule.title}
            </h2>

            {/* Timeline Items */}
            <div className="relative text-left ml-4 sm:ml-8 pl-8 border-l border-amber-300/30 space-y-10">
              {card.schedule.items.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <div 
                    className="absolute -left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white/80 shadow-md transition-transform group-hover:scale-125"
                    style={{ backgroundColor: theme.gold }}
                  />
                  <div 
                    className="font-serif text-sm tracking-wider font-semibold"
                    style={{ color: theme.goldLight }}
                  >
                    {item.time}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-white mt-0.5 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-amber-50/80 leading-relaxed font-light">
                    {item.desc}
                  </p>
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-amber-200/70 mt-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= GALLERY & DYNAMIC MEDIA (IMAGES & VIDEOS) ================= */}
      {card.gallery.enabled && card.gallery.items.length > 0 && (
        <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span 
              className="text-xs uppercase tracking-[0.35em] font-medium block mb-2"
              style={{ color: theme.gold }}
            >
              {card.gallery.eyebrow}
            </span>
            <h2 
              className="font-serif text-3xl sm:text-4xl italic"
              style={{ color: theme.maroon }}
            >
              {card.gallery.title}
            </h2>

            {/* Filter Tabs if both photos and videos exist */}
            {hasVideos && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setMediaFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    mediaFilter === 'all' 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-stone-200/60 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All Media ({card.gallery.items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMediaFilter('image')}
                  className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    mediaFilter === 'image' 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-stone-200/60 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Photos
                </button>
                <button
                  type="button"
                  onClick={() => setMediaFilter('video')}
                  className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    mediaFilter === 'video' 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-stone-200/60 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  Videos
                </button>
              </div>
            )}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[220px]">
            {filteredMedia.map((item) => {
              const isVideo = item.type === 'video';
              const displayThumb = item.thumbnailUrl || (isVideo ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' : item.url);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className={`group relative overflow-hidden rounded-md cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${
                    item.tall ? 'row-span-2' : 'row-span-1'
                  }`}
                >
                  <img
                    src={displayThumb}
                    alt={item.title || item.caption || 'Celebration media'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter saturate-90 group-hover:saturate-110"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    {item.title && <h4 className="font-serif text-base font-medium">{item.title}</h4>}
                    {item.caption && <p className="text-xs text-stone-300 mt-0.5 line-clamp-2">{item.caption}</p>}
                  </div>

                  {/* Video Indicator Badge */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-amber-300/60 flex items-center justify-center text-amber-300 shadow-lg group-hover:scale-115 transition-transform">
                        <Play className="w-5 h-5 fill-amber-300 ml-0.5" />
                      </div>
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 text-[10px] uppercase tracking-wider font-semibold text-amber-300 backdrop-blur-xs flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" /> Video
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= VENUE & MAP ================= */}
      {card.venueSection.enabled && (
        <section 
          className="py-20 px-6 sm:px-12"
          style={{
            backgroundColor: theme.teal,
            color: theme.ivory,
          }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span 
                className="text-xs uppercase tracking-[0.35em] font-medium block mb-2"
                style={{ color: theme.goldLight }}
              >
                {card.venueSection.eyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl italic mb-4">
                {card.venueSection.title}
              </h2>
              <div className="text-lg font-serif mb-2 text-amber-100">
                {card.details.venue}
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-amber-50/80 mb-6 font-light">
                {card.details.city}
                {card.venueSection.directionsText && (
                  <span className="block mt-3 text-xs sm:text-sm text-amber-100/70">
                    {card.venueSection.directionsText}
                  </span>
                )}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-semibold tracking-wide transition-all shadow-md hover:scale-105"
                style={{
                  backgroundColor: theme.gold,
                  color: theme.maroonDeep,
                }}
              >
                <span>Get Directions</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Embedded Map */}
            <div 
              className="w-full h-80 rounded-md overflow-hidden border shadow-xl"
              style={{ borderColor: `${theme.goldLight}40` }}
            >
              <iframe
                title="Venue Map"
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                className="w-full h-full border-0 filter grayscale-[15%] sepia-[10%]"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* ================= COUNTDOWN ================= */}
      {card.countdown.enabled && (
        <section className="py-20 px-6 sm:px-12 text-center max-w-4xl mx-auto">
          <span 
            className="text-xs uppercase tracking-[0.35em] font-medium block mb-2"
            style={{ color: theme.gold }}
          >
            {card.countdown.eyebrow}
          </span>
          <h2 
            className="font-serif text-3xl sm:text-4xl italic mb-8"
            style={{ color: theme.maroon }}
          >
            {card.countdown.title}
          </h2>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((box, idx) => (
              <div
                key={idx}
                className="w-24 sm:w-28 py-5 px-2 rounded-lg border shadow-sm flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: theme.ivory,
                  borderColor: theme.goldLight,
                }}
              >
                <div 
                  className="font-serif text-3xl sm:text-4xl font-bold"
                  style={{ color: theme.maroon }}
                >
                  {String(box.value).padStart(2, '0')}
                </div>
                <div 
                  className="text-[11px] uppercase tracking-[0.15em] font-medium mt-1"
                  style={{ color: theme.gold }}
                >
                  {box.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= RSVP SECTION ================= */}
      {card.rsvp.enabled && (
        <section 
          className="py-20 px-6 sm:px-12"
          style={{
            backgroundColor: theme.maroonDeep,
            color: theme.ivory,
          }}
        >
          <div className="max-w-xl mx-auto text-center">
            <span 
              className="text-xs uppercase tracking-[0.35em] font-medium block mb-2"
              style={{ color: theme.gold }}
            >
              {card.rsvp.eyebrow}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl italic mb-2">
              {card.rsvp.title}
            </h2>
            <p className="text-sm text-amber-100/70 mb-8 font-light">
              {card.rsvp.deadlineText}
            </p>

            {rsvpSubmitted ? (
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg border border-amber-300/30 text-center animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                <h3 className="font-serif text-2xl mb-2 text-white">
                  {rsvpStatus === 'yes' ? 'We Can’t Wait to See You!' : 'Thank You for Responding'}
                </h3>
                <p className="text-sm text-amber-100/80 leading-relaxed font-light">
                  {rsvpStatus === 'yes'
                    ? `Thank you, ${guestName}! Your RSVP has been confirmed for ${attendeesCount} guest${attendeesCount > 1 ? 's' : ''}.`
                    : `Thank you for letting us know, ${guestName}. You will be warmly remembered!`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRsvpSubmitted(false);
                    setGuestName('');
                    setGuestMobile('');
                    setGuestMessage('');
                    setRsvpStatus(null);
                  }}
                  className="mt-6 text-xs text-amber-300 underline hover:text-amber-200 cursor-pointer"
                >
                  Submit another RSVP
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] mb-1.5 font-medium" style={{ color: theme.goldLight }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anjali Sharma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-amber-200/30 text-white placeholder-amber-200/40 focus:outline-hidden focus:border-amber-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] mb-1.5 font-medium" style={{ color: theme.goldLight }}>
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={guestMobile}
                    onChange={(e) => setGuestMobile(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-amber-200/30 text-white placeholder-amber-200/40 focus:outline-hidden focus:border-amber-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] mb-2 font-medium" style={{ color: theme.goldLight }}>
                    Will you attend? *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('yes')}
                      className={`py-3 px-4 rounded text-sm font-medium border transition-all cursor-pointer ${
                        rsvpStatus === 'yes'
                          ? 'border-amber-400 bg-amber-400 text-stone-950 font-semibold shadow-md'
                          : 'border-amber-200/30 text-white hover:bg-white/10'
                      }`}
                    >
                      {card.rsvp.acceptLabel || 'Joyfully Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('no')}
                      className={`py-3 px-4 rounded text-sm font-medium border transition-all cursor-pointer ${
                        rsvpStatus === 'no'
                          ? 'border-rose-400 bg-rose-500/30 text-rose-200 font-semibold shadow-md'
                          : 'border-amber-200/30 text-white hover:bg-white/10'
                      }`}
                    >
                      {card.rsvp.declineLabel || 'Regretfully Decline'}
                    </button>
                  </div>
                </div>

                {rsvpStatus === 'yes' && (
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] mb-1.5 font-medium" style={{ color: theme.goldLight }}>
                      Number of Guests Attending
                    </label>
                    <select
                      value={attendeesCount}
                      onChange={(e) => setAttendeesCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded bg-white/10 border border-amber-200/30 text-white focus:outline-hidden focus:border-amber-300 text-sm"
                    >
                      <option value={1} className="bg-stone-900 text-white">1 Guest</option>
                      <option value={2} className="bg-stone-900 text-white">2 Guests</option>
                      <option value={3} className="bg-stone-900 text-white">3 Guests</option>
                      <option value={4} className="bg-stone-900 text-white">4 Guests</option>
                      <option value={5} className="bg-stone-900 text-white">5+ Guests</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] mb-1.5 font-medium" style={{ color: theme.goldLight }}>
                    Special Wishes or Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Leave a heartfelt message for the hosts..."
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-amber-200/30 text-white placeholder-amber-200/40 focus:outline-hidden focus:border-amber-300 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!guestName.trim() || !rsvpStatus}
                  className="w-full py-3.5 px-6 rounded font-semibold text-sm tracking-wide transition-all shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    backgroundColor: theme.gold,
                    color: theme.maroonDeep,
                  }}
                >
                  Send RSVP
                </button>
              </form>
            )}

            {/* Live RSVP Stats */}
            <div className="flex justify-center gap-8 sm:gap-12 mt-12 pt-8 border-t border-amber-300/20">
              <div className="text-center">
                <div className="font-serif text-2xl font-bold text-amber-300">{rsvpsList.length}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-amber-100/60 mt-0.5">Responded</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-2xl font-bold text-emerald-400">{acceptedCount}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-amber-100/60 mt-0.5">Accepted</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-2xl font-bold text-rose-400">{declinedCount}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-amber-100/60 mt-0.5">Declined</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="py-14 px-6 text-center border-t border-stone-200/50 flex flex-col items-center">
        <span 
          className="font-script text-3xl sm:text-4xl block mb-2"
          style={{ color: theme.gold }}
        >
          {card.footer.signature || card.hosts.person1}
        </span>
        <div className="text-xs tracking-wider text-stone-500 font-light mb-8 max-w-md">
          {card.footer.fineText}
        </div>

        {/* Creator Management Controls - Only visible to authenticated owner */}
        {isOwner && (
          <div className="pt-6 border-t border-stone-300/40 w-full max-w-sm flex flex-col items-center">
            <span className="text-[11px] text-stone-500 uppercase tracking-widest font-medium mb-2.5">
              Creator Controls
            </span>
            <div className="flex items-center gap-2">
              {onGoToAdmin && (
                <button
                  type="button"
                  onClick={onGoToAdmin}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold shadow-md transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: theme.maroon,
                    color: theme.ivory,
                    border: `1px solid ${theme.goldLight}`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Manage in Admin Portal</span>
                </button>
              )}
              {onGoHome && (
                <button
                  type="button"
                  onClick={onGoHome}
                  className="px-4 py-2.5 rounded-full text-xs font-medium border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-all cursor-pointer shadow-xs"
                >
                  Studio Home
                </button>
              )}
            </div>
          </div>
        )}
      </footer>

      {/* Media Lightbox */}
      <LightboxModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </div>
  );
};
