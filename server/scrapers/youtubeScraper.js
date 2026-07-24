import axios from 'axios';

export async function scrapeYouTubeUrl(url) {
  try {
    // Extract video ID or channel handle from URL
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) NFLPredictionTally/1.0' }
    });

    const html = response.data;
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace('- YouTube', '').trim() : 'YouTube Video Predictions';

    // Extract description text snippet
    const descMatch = html.match(/"description":\{"simpleText":"(.*?)"\}/);
    const description = descMatch ? descMatch[1] : '';

    return {
      platform: 'YOUTUBE',
      url,
      posts: [
        {
          title,
          content: `${title}\n${description}`,
          author: 'YouTube Channel',
          url
        }
      ]
    };
  } catch (error) {
    console.error(`Error scraping YouTube URL ${url}:`, error.message);
    return { platform: 'YOUTUBE', url, posts: [] };
  }
}
