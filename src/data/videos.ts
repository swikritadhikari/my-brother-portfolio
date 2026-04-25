export interface Video {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  thumbnail: string;
  type?: 'video' | 'short';
}

export const initialVideos: Video[] = [];
