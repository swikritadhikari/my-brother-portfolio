export interface Video {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  thumbnail: string;
  type?: 'video' | 'short';
}

export const initialVideos: Video[] = [
  {
    id: '1',
    title: 'Cyberpunk Narrative Edit',
    category: 'Commercial',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    title: 'Mountain Bike Cinematic',
    category: 'Sport',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    title: 'Minimalist Tech Showcase',
    category: 'Product',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    title: 'Urban Exploration Vlog',
    category: 'Vlog',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80',
  },
];
