"use server";

export async function fetchChannelVideos(channelId: string) {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch from YouTube RSS: ${res.status}`);
    }
    const xml = await res.text();
    if (!xml.includes("<entry>")) {
      throw new Error(
        "This channel ID seems valid, but YouTube returned an empty feed. Try again in a few minutes.",
      );
    }

    // Improved regex to capture video IDs more reliably
    const entryBlocks = xml.split("<entry>").slice(1); // Split by entry tag

    const videos = await Promise.all(
      entryBlocks.map(async (block) => {
        const videoIdMatch = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
        const titleMatch = block.match(/<title>(.*?)<\/title>/);

        const videoId = videoIdMatch ? videoIdMatch[1] : "";
        const title = titleMatch
          ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
          : "Untitled Video";

        if (!videoId) return null;

        let isShort = false;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          // If a video is a regular video, visiting /shorts/ID will redirect to /watch?v=ID
          const checkRes = await fetch(
            `https://www.youtube.com/shorts/${videoId}`,
            {
              method: "GET", // Using GET to ensure we follow redirects fully
              redirect: "follow",
              signal: controller.signal,
            },
          );
          clearTimeout(timeoutId);

          // ONLY label as short if the URL still says "/shorts/"
          if (checkRes.url.includes("/shorts/")) {
            isShort = true;
          }
        } catch (e) {
          // If the check fails (timeout or network), assume it's a regular video
          isShort = false;
        }

        return {
          id: `yt-${videoId}`,
          title: title.length > 50 ? title.substring(0, 50) + "..." : title,
          category: isShort ? "Shorts" : "Cinematic Vlog",
          youtubeId: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          type: (isShort ? "short" : "video") as "short" | "video",
        };
      }),
    );

    const validVideos = videos.filter((v) => v !== null);
    return { success: true, videos: validVideos };
  } catch (error) {
    console.error("Fetch Channel Videos Error:", error);
    return { success: false, error: (error as Error).message };
  }
}
