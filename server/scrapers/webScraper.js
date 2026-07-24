import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWebUrl(url) {
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) NFLPredictionTally/1.0' }
    });

    const $ = cheerio.load(response.data);
    const title = $('title').text() || $('h1').first().text() || 'Sports Article';

    // Remove scripts, styles
    $('script, style, nav, footer, header').remove();

    const paragraphs = [];
    $('p, h2, h3, li').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt.length > 15) {
        paragraphs.push(txt);
      }
    });

    return {
      platform: 'WEB',
      url,
      posts: [
        {
          title,
          content: `${title}\n${paragraphs.join('\n')}`,
          author: 'Sports Writer',
          url
        }
      ]
    };
  } catch (error) {
    console.error(`Error scraping Web URL ${url}:`, error.message);
    return { platform: 'WEB', url, posts: [] };
  }
}
