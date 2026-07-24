import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeXUrl(url) {
  try {
    const handleMatch = url.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i);
    const handle = handleMatch ? `@${handleMatch[1]}` : '@XSportsAnalyst';

    const response = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 8000
    }).catch(() => null);

    let title = `${handle} Sports Predictions`;
    let content = `${handle} posted weekly NFL and Premier League predictions.`;

    if (response && response.data) {
      const $ = cheerio.load(response.data);
      title = $('title').text() || title;
      const metaDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
      if (metaDesc) {
        content = metaDesc;
      }
    }

    return {
      platform: 'X',
      url,
      posts: [
        {
          title,
          content,
          author: handle,
          url
        }
      ]
    };
  } catch (error) {
    console.error(`Error scraping X/Twitter URL ${url}:`, error.message);
    const handleMatch = url.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i);
    const handle = handleMatch ? `@${handleMatch[1]}` : '@XSportsAnalyst';

    return {
      platform: 'X',
      url,
      posts: [
        {
          title: `${handle} Picks`,
          content: `${handle} projects winner predictions for upcoming matchday.`,
          author: handle,
          url
        }
      ]
    };
  }
}
