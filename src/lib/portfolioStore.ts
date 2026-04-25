import { initialVideos, Video } from '@/data/videos';

const STORAGE_KEY = 'portfolio-data';

export interface SiteSettings {
  siteName: string;
  heroTagline: string;
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroDescription: string;
  aboutText: string;
  contactEmail: string;
  showreelId: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  aboutBgImage: string;
  footerLine1: string;
  footerLine2: string;
  copyrightText: string;
  faviconUrl: string;
  preloaderText: string;
  preloaderSubtext: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'visitor';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  _id?: string;
  visitorName: string;
  visitorEmail: string;
  status: 'new' | 'read' | 'replied';
  messages: ChatMessage[];
  lastUpdate: string;
}

const defaultSettings: SiteSettings = {
  siteName: '',
  heroTagline: '',
  heroLine1: '',
  heroLine2: '',
  heroLine3: '',
  heroDescription: '',
  aboutText: '',
  contactEmail: '',
  showreelId: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  aboutBgImage: '',
  footerLine1: '',
  footerLine2: '',
  copyrightText: `© ${new Date().getFullYear()} All rights reserved.`,
  faviconUrl: '/favicon.ico',
  preloaderText: 'INITIALIZING',
  preloaderSubtext: 'LOADING CREATIVE FLOW',
  avatarUrl: ''
};

interface PortfolioData {
  videos: Video[];
  settings: SiteSettings;
  conversations: Conversation[];
}

let data: PortfolioData = {
  videos: initialVideos,
  settings: defaultSettings,
  conversations: []
};

// MUST be a stable reference - React calls this on every render during SSR
const serverSnapshot: PortfolioData = {
  videos: initialVideos,
  settings: defaultSettings,
  conversations: []
};

const listeners = new Set<() => void>();

let initialized = false;

export const portfolioStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  
  getSnapshot() {
    if (typeof window === 'undefined') return data;
    
    if (!initialized) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          data = {
            ...data,
            ...parsed,
            conversations: parsed.conversations || [],
            settings: { ...defaultSettings, ...(parsed.settings || {}) }
          };
        } catch (e) {
          console.error('Failed to parse portfolio data', e);
        }
      }
      initialized = true;
    }
    return data;
  },

  getServerSnapshot(): PortfolioData {
    return serverSnapshot;
  },

  updateVideos(newVideos: Video[]) {
    data = { ...data, videos: newVideos };
    this.save();
  },

  updateSettings(newSettings: SiteSettings) {
    data = { ...data, settings: newSettings };
    this.save();
  },

  updateConversations(newConversations: Conversation[]) {
    data = { ...data, conversations: newConversations };
    this.save();
  },

  save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    listeners.forEach(l => l());
  },

  setConversations(newConversations: Conversation[]) {
    data = { ...data, conversations: newConversations };
    // We don't save to localStorage here because DB is the source of truth for chat
    listeners.forEach(l => l());
  }
};

// Cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        data = {
          ...data,
          ...parsed,
          conversations: parsed.conversations || [],
          settings: { ...defaultSettings, ...(parsed.settings || {}) }
        };
        // Notify all local listeners that the state changed from another tab
        listeners.forEach(l => l());
      } catch (e) {
        console.error('Failed to sync portfolio data from storage event', e);
      }
    }
  });
}
