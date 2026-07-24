import axios from 'axios';
import { parsePredictionsFromText } from '../services/aiParser.js';

export async function scrapeRedditUrl(url) {
  try {
    let cleanUrl = url;
    if (!cleanUrl.endsWith('.json')) {
      cleanUrl = cleanUrl.replace(/\/$/, '') + '.json';
    }

    const response = await axios.get(cleanUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) NFLPredictionTally/1.0' }
    });

    const posts = [];
    const data = response.data;

    if (Array.isArray(data)) {
      // Thread link response
      const mainPost = data[0]?.data?.children?.[0]?.data;
      if (mainPost) {
        posts.push({
          title: mainPost.title,
          content: `${mainPost.title}\n${mainPost.selftext || ''}`,
          author: mainPost.author || 'RedditUser',
          url: url
        });
      }

      // Extract top comments
      const comments = data[1]?.data?.children || [];
      for (const comment of comments.slice(0, 10)) {
        if (comment.data && comment.data.body) {
          posts.push({
            title: `Comment by u/${comment.data.author}`,
            content: comment.data.body,
            author: comment.data.author || 'RedditUser',
            url: url
          });
        }
      }
    } else if (data?.data?.children) {
      // Subreddit listing response
      for (const item of data.data.children) {
        if (item.data) {
          posts.push({
            title: item.data.title,
            content: `${item.data.title}\n${item.data.selftext || ''}`,
            author: item.data.author || 'RedditUser',
            url: `https://reddit.com${item.data.permalink}`
          });
        }
      }
    }

    return {
      platform: 'REDDIT',
      url,
      posts
    };
  } catch (error) {
    console.error(`Error scraping Reddit URL ${url}:`, error.message);
    return { platform: 'REDDIT', url, posts: [] };
  }
}
