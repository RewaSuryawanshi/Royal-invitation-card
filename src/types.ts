export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  maroon: string;      // Main dark / hero background
  maroonDeep: string;  // Deepest dark for footer / rsvp / hero gradient
  gold: string;        // Signature gold accent
  goldLight: string;   // Light gold for highlights, badges, borders
  ivory: string;       // Primary background for light sections
  teal: string;        // Rich contrast for venue / secondary sections
  blush: string;       // Soft rose / blush accent
  ink: string;         // Dark text color on light backgrounds
  is3D?: boolean;
  styleTag?: string;
  description?: string;
  bgImageUrl?: string;
  archType?: 'udaipur-jharokha' | 'sheesh-mahal' | 'varanasi-mandap' | 'mughal-jali' | 'classic';
  particlesType?: 'marigold' | 'mirrors' | 'diyas' | 'lotus' | 'sparkles';
  glowColor?: string;
  ornamentStyle?: 'rajputana' | 'sheesh' | 'temple' | 'mughal';
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  caption?: string;
  tall?: boolean;
  videoType?: 'url' | 'youtube' | 'uploaded';
  thumbnailUrl?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  desc: string;
  location?: string;
}

export interface RSVPResponse {
  id: string;
  cardId: string;
  name: string;
  mobile: string;
  status: 'yes' | 'no';
  attendeesCount?: number;
  message?: string;
  createdAt: string;
}

export interface InvitationCard {
  id: string;
  userId: string; // Only this user can see and manage this card in the portal!
  slug: string;
  status: 'published' | 'draft';
  title: string;
  eventType: 'wedding' | 'birthday' | 'anniversary' | 'gala' | 'party' | 'other';
  hosts: {
    person1: string;
    person2?: string;
    conjunction: string; // "&" or "and"
    eyebrow: string;
    tagline: string;
  };
  details: {
    dateLabel: string;
    isoDate: string;
    time: string;
    venue: string;
    city: string;
    mapQuery?: string;
  };
  story: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    content: string;
  };
  schedule: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    items: ScheduleItem[];
  };
  gallery: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    items: MediaItem[];
  };
  venueSection: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    directionsText?: string;
  };
  countdown: {
    enabled: boolean;
    eyebrow: string;
    title: string;
  };
  rsvp: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    deadlineText: string;
    acceptLabel: string;
    declineLabel: string;
  };
  footer: {
    signature: string;
    fineText: string;
  };
  theme: ColorTheme;
  createdAt: string;
  updatedAt: string;
}
