'use server';

export async function fetchChannelVideos(channelId: string) {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch from YouTube RSS: ${res.status}`);
    }
    const xml = await res.text();
    
    // Quick and safe regex extraction from the RSS feed
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    
    const parsedEntries = entries.map(entry => {
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      
      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      const title = titleMatch ? titleMatch[1] : '';
      return { videoId, title };
    }).filter(v => v.videoId);

    // Automatically categorize as Short vs Main Video by inspecting YouTube's redirect behavior!
    const videos = await Promise.all(parsedEntries.map(async ({ videoId, title }) => {
      let isShort = false;
      try {
        // A request to /shorts/ID will redirect to /watch?v=ID if it's NOT a short!
        const checkRes = await fetch(`https://www.youtube.com/shorts/${videoId}`, { method: 'HEAD' });
        if (!checkRes.url.includes('/watch')) {
          isShort = true;
        }
      } catch {
        // Fallback silently if network fails
      }

      return {
        id: `yt-${videoId}`,
        title,
        category: isShort ? 'Shorts' : 'Cinematic Vlog',
        youtubeId: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        type: (isShort ? 'short' : 'video') as 'short' | 'video'
      };
    }));
    
    return { success: true, videos };
  } catch (error) {
    console.error('Fetch Channel Videos Error:', error);
    return { success: false, error: (error as Error).message };
  }
}
