import React, { useState } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye, 
  Palette, 
  Calendar, 
  Image as ImageIcon, 
  Film, 
  Clock, 
  FileText, 
  CheckCircle, 
  MapPin, 
  Users, 
  Sparkles,
  Upload,
  Link as LinkIcon,
  Maximize2
} from 'lucide-react';
import { InvitationCard, MediaItem, ScheduleItem, ColorTheme } from '../types';
import { THEME_PRESETS } from '../services/storage';
import { ClientInvitation } from './ClientInvitation';

interface CardEditorProps {
  initialCard: InvitationCard;
  onSave: (card: InvitationCard) => void;
  onCancel: () => void;
  onPreviewFull: (card: InvitationCard) => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({
  initialCard,
  onSave,
  onCancel,
  onPreviewFull,
}) => {
  const [card, setCard] = useState<InvitationCard>(initialCard);
  const [activeTab, setActiveTab] = useState<'details' | 'story' | 'schedule' | 'media' | 'theme' | 'rsvp' | 'preview'>('details');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Media state
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [newMediaTall, setNewMediaTall] = useState(false);
  const [newMediaThumb, setNewMediaThumb] = useState('');

  // New Schedule Item state
  const [newSchTime, setNewSchTime] = useState('');
  const [newSchTitle, setNewSchTitle] = useState('');
  const [newSchDesc, setNewSchDesc] = useState('');
  const [newSchLocation, setNewSchLocation] = useState('');

  const handleSave = () => {
    onSave(card);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Add media item
  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    const item: MediaItem = {
      id: `med_${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl.trim(),
      title: newMediaTitle.trim() || undefined,
      caption: newMediaCaption.trim() || undefined,
      tall: newMediaTall,
      thumbnailUrl: newMediaThumb.trim() || undefined,
    };
    setCard((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: [item, ...prev.gallery.items],
      },
    }));
    setNewMediaUrl('');
    setNewMediaTitle('');
    setNewMediaCaption('');
    setNewMediaThumb('');
    setNewMediaTall(false);
  };

  // Handle local file upload for image or video
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = reader.result as string;
      setNewMediaType(type);
      setNewMediaUrl(resultUrl);
      if (!newMediaTitle) {
        setNewMediaTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = (id: string) => {
    setCard((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.filter((m) => m.id !== id),
      },
    }));
  };

  // Add schedule item
  const handleAddScheduleItem = () => {
    if (!newSchTime.trim() || !newSchTitle.trim()) return;
    const newItem: ScheduleItem = {
      id: `sch_${Date.now()}`,
      time: newSchTime.trim(),
      title: newSchTitle.trim(),
      desc: newSchDesc.trim(),
      location: newSchLocation.trim() || undefined,
    };
    setCard((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        items: [...prev.schedule.items, newItem],
      },
    }));
    setNewSchTime('');
    setNewSchTitle('');
    setNewSchDesc('');
    setNewSchLocation('');
  };

  const handleRemoveScheduleItem = (id: string) => {
    setCard((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        items: prev.schedule.items.filter((s) => s.id !== id),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                {card.title || 'Untitled Card'}
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                card.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {card.status}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Editing invitation details, dynamic media, and styling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onPreviewFull(card)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen Preview</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            {saveSuccess ? <CheckCircle className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Form Tabs & Controls */}
        <div className="w-full lg:w-[55%] xl:w-[50%] bg-white border-r border-stone-200 flex flex-col h-[calc(100vh-61px)] overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 overflow-x-auto bg-stone-50/70 sticky top-0 z-10 px-2">
            {[
              { id: 'details', label: 'Basics & Venue', icon: Calendar },
              { id: 'theme', label: 'Theme & Colors', icon: Palette },
              { id: 'story', label: 'Our Story', icon: FileText },
              { id: 'media', label: 'Media (Photo & Video)', icon: ImageIcon },
              { id: 'schedule', label: 'Timeline', icon: Clock },
              { id: 'rsvp', label: 'RSVP & Footer', icon: Users },
              { id: 'preview', label: 'Live Preview', icon: Eye, mobileOnly: true },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    tab.mobileOnly ? 'lg:hidden' : ''
                  } ${
                    isActive
                      ? 'border-amber-600 text-amber-900 bg-white'
                      : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            {/* ================= TAB 1: DETAILS & VENUE ================= */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">
                    Event Identification
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Internal Card Title (in your admin portal)
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => setCard({ ...card, title: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm focus:ring-1 focus:ring-amber-500"
                        placeholder="e.g. Rahul & Priya Wedding"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Card Status
                      </label>
                      <select
                        value={card.status}
                        onChange={(e) => setCard({ ...card, status: e.target.value as any })}
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="published">Published (Live to guests)</option>
                        <option value="draft">Draft (Private)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Event Type
                      </label>
                      <select
                        value={card.eventType}
                        onChange={(e) => setCard({ ...card, eventType: e.target.value as any })}
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="wedding">Wedding / Marriage</option>
                        <option value="birthday">Birthday Celebration</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="gala">Gala / Soirée</option>
                        <option value="party">Cocktail & Party</option>
                        <option value="other">Other Celebration</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">
                    Hosts & Ceremony Names (Hero Section)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Primary Host / Bride Name *
                      </label>
                      <input
                        type="text"
                        value={card.hosts.person1}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            hosts: { ...card.hosts, person1: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. Priya"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Secondary Host / Groom Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={card.hosts.person2 || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            hosts: { ...card.hosts, person2: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. Rahul"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Top Eyebrow Text
                      </label>
                      <input
                        type="text"
                        value={card.hosts.eyebrow}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            hosts: { ...card.hosts, eyebrow: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. Together with their families"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Hero Tagline / Invitation Message
                      </label>
                      <textarea
                        rows={2}
                        value={card.hosts.tagline}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            hosts: { ...card.hosts, tagline: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. request the pleasure of your company at their wedding"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">
                    Date, Time & Venue
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Display Date Label
                      </label>
                      <input
                        type="text"
                        value={card.details.dateLabel}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            details: { ...card.details, dateLabel: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. 25 December 2026"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Display Time
                      </label>
                      <input
                        type="text"
                        value={card.details.time}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            details: { ...card.details, time: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. 7:00 PM"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        ISO Date for Live Countdown
                      </label>
                      <input
                        type="datetime-local"
                        value={card.details.isoDate.substring(0, 16)}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            details: { ...card.details, isoDate: new Date(e.target.value).toISOString() },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        value={card.details.venue}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            details: { ...card.details, venue: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. Taj Krishna"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        City & Address
                      </label>
                      <input
                        type="text"
                        value={card.details.city}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            details: { ...card.details, city: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. Hyderabad, Telangana"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Directions & Parking Note
                      </label>
                      <textarea
                        rows={2}
                        value={card.venueSection.directionsText || ''}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            venueSection: {
                              ...card.venueSection,
                              directionsText: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. Valet parking available at the main porch."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: THEME & COLORS ================= */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Preset Royal Palettes
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Choose an exquisite royal color scheme matching your celebration's ambiance.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {THEME_PRESETS.map((preset) => {
                      const isSelected = card.theme.id === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => setCard({ ...card, theme: preset })}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/50 shadow-sm'
                              : 'border-stone-200 hover:border-stone-400 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-serif font-semibold text-sm text-stone-900">
                              {preset.name}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">
                                Active
                              </span>
                            )}
                          </div>
                          {/* Color bar preview */}
                          <div className="flex h-6 rounded-md overflow-hidden border border-black/10">
                            <div className="flex-1" style={{ backgroundColor: preset.maroon }} title="Primary Deep" />
                            <div className="flex-1" style={{ backgroundColor: preset.gold }} title="Gold Accent" />
                            <div className="flex-1" style={{ backgroundColor: preset.goldLight }} title="Gold Light" />
                            <div className="flex-1" style={{ backgroundColor: preset.teal }} title="Contrast Teal" />
                            <div className="flex-1" style={{ backgroundColor: preset.blush }} title="Blush" />
                            <div className="flex-1" style={{ backgroundColor: preset.ivory }} title="Ivory Canvas" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">
                    Custom Theme Color Adjustments
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Hero Deep Tone
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={card.theme.maroon}
                          onChange={(e) =>
                            setCard({
                              ...card,
                              theme: { ...card.theme, maroon: e.target.value },
                            })
                          }
                          className="w-8 h-8 rounded border border-stone-300 p-0 cursor-pointer"
                        />
                        <span className="text-xs font-mono">{card.theme.maroon}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Gold Accent
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={card.theme.gold}
                          onChange={(e) =>
                            setCard({
                              ...card,
                              theme: { ...card.theme, gold: e.target.value },
                            })
                          }
                          className="w-8 h-8 rounded border border-stone-300 p-0 cursor-pointer"
                        />
                        <span className="text-xs font-mono">{card.theme.gold}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Ivory Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={card.theme.ivory}
                          onChange={(e) =>
                            setCard({
                              ...card,
                              theme: { ...card.theme, ivory: e.target.value },
                            })
                          }
                          className="w-8 h-8 rounded border border-stone-300 p-0 cursor-pointer"
                        />
                        <span className="text-xs font-mono">{card.theme.ivory}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: STORY ================= */}
            {activeTab === 'story' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                    Story Section
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.story.enabled}
                      onChange={(e) =>
                        setCard({
                          ...card,
                          story: { ...card.story, enabled: e.target.checked },
                        })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Show Story Section</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Section Eyebrow
                  </label>
                  <input
                    type="text"
                    value={card.story.eyebrow}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        story: { ...card.story, eyebrow: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                    placeholder="e.g. Our Story"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Story Headline
                  </label>
                  <input
                    type="text"
                    value={card.story.title}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        story: { ...card.story, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-stone-300 text-sm font-serif"
                    placeholder="e.g. Two paths, one journey"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Story Content (Paragraphs)
                  </label>
                  <textarea
                    rows={6}
                    value={card.story.content}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        story: { ...card.story, content: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-stone-300 text-sm leading-relaxed"
                    placeholder="Tell your guests how your journey began..."
                  />
                </div>
              </div>
            )}

            {/* ================= TAB 4: DYNAMIC MEDIA (IMAGES & VIDEOS) ================= */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Dynamic Media (Images & Videos)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Add photos, engagement video clips, pre-wedding teasers, or party highlights!
                  </p>
                </div>

                {/* Add New Media Card */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Add New Media Item
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewMediaType('image')}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                          newMediaType === 'image'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white border border-stone-300 text-stone-700'
                        }`}
                      >
                        Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewMediaType('video')}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                          newMediaType === 'video'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white border border-stone-300 text-stone-700'
                        }`}
                      >
                        Video
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {newMediaType === 'image' ? 'Image URL or Upload' : 'Video URL (MP4, YouTube, Vimeo) or Upload'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded border border-stone-300 text-xs bg-white"
                        placeholder={
                          newMediaType === 'image'
                            ? 'https://images.unsplash.com/... or paste image link'
                            : 'https://.../video.mp4 or YouTube link'
                        }
                      />
                      <label className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>File</span>
                        <input
                          type="file"
                          accept={newMediaType === 'image' ? 'image/*' : 'video/*'}
                          onChange={(e) => handleFileUpload(e, newMediaType)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-stone-300 text-xs bg-white"
                        placeholder="e.g. Ring Ceremony"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Caption / Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={newMediaCaption}
                        onChange={(e) => setNewMediaCaption(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-stone-300 text-xs bg-white"
                        placeholder="e.g. Sunset in Udaipur"
                      />
                    </div>
                  </div>

                  {newMediaType === 'video' && (
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Video Poster / Thumbnail URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={newMediaThumb}
                        onChange={(e) => setNewMediaThumb(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-stone-300 text-xs bg-white"
                        placeholder="https://images.unsplash.com/... thumbnail"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMediaTall}
                        onChange={(e) => setNewMediaTall(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Display as Tall Portrait (Spans 2 rows in gallery)</span>
                    </label>

                    <button
                      type="button"
                      disabled={!newMediaUrl.trim()}
                      onClick={handleAddMedia}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Add to Gallery
                    </button>
                  </div>
                </div>

                {/* Current Media Items List */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Current Gallery Items ({card.gallery.items.length})
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {card.gallery.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative group rounded-lg overflow-hidden border border-stone-200 bg-stone-50 shadow-xs"
                      >
                        <div className="h-28 w-full bg-stone-200 relative">
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.title || 'Media preview'}
                            className="w-full h-full object-cover"
                          />
                          {item.type === 'video' && (
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-[10px] text-amber-300 rounded font-semibold flex items-center gap-1">
                              <Film className="w-2.5 h-2.5" /> Video
                            </span>
                          )}
                          {item.tall && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-stone-900/70 text-[10px] text-white rounded font-medium">
                              Tall
                            </span>
                          )}
                        </div>

                        <div className="p-2 flex items-center justify-between">
                          <div className="truncate text-xs font-medium text-stone-800 pr-1">
                            {item.title || `Item #${idx + 1}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(item.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 5: SCHEDULE / TIMELINE ================= */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Event Schedule Timeline
                  </h3>
                  <p className="text-xs text-stone-500">
                    List events such as Mehndi, Sangeet, Wedding Vows, Dinner, or Birthday Cake cutting.
                  </p>
                </div>

                {/* Add new schedule item */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Add Schedule Event
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Time / Day Label *
                      </label>
                      <input
                        type="text"
                        value={newSchTime}
                        onChange={(e) => setNewSchTime(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-stone-300 text-xs bg-white"
                        placeholder="e.g. 24 Dec — 5:00 PM"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={newSchTitle}
                        onChange={(e) => setNewSchTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-stone-300 text-xs bg-white"
                        placeholder="e.g. Mehndi & Sangeet"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newSchDesc}
                        onChange={(e) => setNewSchDesc(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-stone-300 text-xs bg-white"
                        placeholder="e.g. Family lawn, music, dinner and dance performances"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      disabled={!newSchTime.trim() || !newSchTitle.trim()}
                      onClick={handleAddScheduleItem}
                      className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Add Event
                    </button>
                  </div>
                </div>

                {/* List of items */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Events in Schedule ({card.schedule.items.length})
                  </div>

                  {card.schedule.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-white shadow-xs"
                    >
                      <div>
                        <div className="text-xs font-bold text-amber-700">{item.time}</div>
                        <div className="text-sm font-serif font-semibold text-stone-900">{item.title}</div>
                        <div className="text-xs text-stone-500">{item.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveScheduleItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 6: RSVP & FOOTER ================= */}
            {activeTab === 'rsvp' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">
                    RSVP Configuration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        RSVP Section Title
                      </label>
                      <input
                        type="text"
                        value={card.rsvp.title}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            rsvp: { ...card.rsvp, title: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm font-serif"
                        placeholder="e.g. Will you be there?"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        RSVP Deadline Text
                      </label>
                      <input
                        type="text"
                        value={card.rsvp.deadlineText}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            rsvp: { ...card.rsvp, deadlineText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. Kindly respond by 1st December 2026"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Accept Button Label
                        </label>
                        <input
                          type="text"
                          value={card.rsvp.acceptLabel}
                          onChange={(e) =>
                            setCard({
                              ...card,
                              rsvp: { ...card.rsvp, acceptLabel: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                          placeholder="e.g. Joyfully Accept"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Decline Button Label
                        </label>
                        <input
                          type="text"
                          value={card.rsvp.declineLabel}
                          onChange={(e) =>
                            setCard({
                              ...card,
                              rsvp: { ...card.rsvp, declineLabel: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                          placeholder="e.g. Regretfully Decline"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">
                    Footer Text & Signature
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Signature Names (Script font)
                      </label>
                      <input
                        type="text"
                        value={card.footer.signature}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            footer: { ...card.footer, signature: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm font-script text-xl"
                        placeholder="e.g. Rahul & Priya"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Footer Note / Fine Print
                      </label>
                      <input
                        type="text"
                        value={card.footer.fineText}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            footer: { ...card.footer, fineText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded border border-stone-300 text-sm"
                        placeholder="e.g. Made with love · 25 December 2026 · Hyderabad"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile-only preview tab */}
            {activeTab === 'preview' && (
              <div className="lg:hidden rounded-xl overflow-hidden shadow-lg border border-stone-300">
                <ClientInvitation card={card} />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Real-time Live Preview Screen (Desktop) */}
        <div className="hidden lg:flex flex-1 flex-col h-[calc(100vh-61px)] bg-stone-900 border-l border-stone-200 overflow-hidden">
          {/* Preview Bar Header */}
          <div className="px-4 py-2 bg-stone-800 text-white flex items-center justify-between text-xs border-b border-stone-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Live Dynamic Preview</span>
              <span className="text-stone-400">| Updates in real time</span>
            </div>
            <button
              type="button"
              onClick={() => onPreviewFull(card)}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>

          {/* Scaled Preview Frame */}
          <div className="flex-1 overflow-y-auto bg-stone-950 p-4 flex justify-center">
            <div className="w-full max-w-[840px] shadow-2xl rounded-lg overflow-hidden border border-stone-800 bg-white">
              <ClientInvitation card={card} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
