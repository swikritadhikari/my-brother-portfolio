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
  visitorName: string;
  visitorEmail: string;
  status: 'new' | 'read' | 'replied';
  messages: ChatMessage[];
  lastUpdate: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'BINAYA.',
  heroTagline: 'Creative Director & Elite Editor',
  heroLine1: 'CRAFTING',
  heroLine2: 'CINEMATIC',
  heroLine3: 'STORIES',
  heroDescription: 'Transforming vision into high-end visual reality. Specializing in narrative pace, color physics, and emotional resonance.',
  aboutText: 'Professional video editor with over 10 years of experience in high-end commercial and narrative work.',
  contactEmail: 'hello@binaya.com',
  showreelId: 'dQw4w9WgXcQ',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/',
  youtube: 'https://youtube.com/',
  aboutBgImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000',
  footerLine1: 'LET\'S CREATE',
  footerLine2: 'SOMETHING EPIC',
  copyrightText: '© 2026 All rights reserved. Made by Sulabh (aka Swikrit)',
  faviconUrl: '/favicon.ico',
  preloaderText: 'BINAYA CINEMATICS',
  preloaderSubtext: 'INITIALIZING CREATIVE FLOW',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80'
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
