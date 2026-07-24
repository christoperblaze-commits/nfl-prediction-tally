import { describe, it, expect, vi } from 'vitest';
import { parsePredictionsFromText } from '../server/services/aiParser.js';
import { scrapeRedditUrl } from '../server/scrapers/redditScraper.js';
import { scrapeYouTubeUrl } from '../server/scrapers/youtubeScraper.js';
import { scrapeWebUrl } from '../server/scrapers/webScraper.js';
import axios from 'axios';

vi.mock('axios');

describe('AI Pick Parser Engine', () => {
  it('should extract picks correctly from natural language text', () => {
    const text = "I am locking in the Kansas City Chiefs over Baltimore Ravens. Also picking Philadelphia Eagles to beat Dallas Cowboys.";
    const picks = parsePredictionsFromText(text, 'User99');

    expect(picks.length).toBe(2);
    expect(picks[0].predictor_name).toBe('User99');
    expect(picks[0].picked_team_name).toContain('Kansas City Chiefs');
    expect(picks[1].picked_team_name).toContain('Philadelphia Eagles');
  });

  it('should handle team nicknames and abbreviations', () => {
    const text = "KC takes it, 49ers beat Rams";
    const picks = parsePredictionsFromText(text, 'ExpertAnalyst');

    expect(picks.length).toBeGreaterThanOrEqual(2);
    const kcPick = picks.find(p => p.picked_team_name.includes('Chiefs'));
    const sfPick = picks.find(p => p.picked_team_name.includes('49ers'));

    expect(kcPick).toBeDefined();
    expect(sfPick).toBeDefined();
  });
});

describe('Multi-Source Scrapers', () => {
  it('should extract posts from Reddit JSON URL', async () => {
    const mockRedditData = [
      {
        data: {
          children: [
            {
              data: {
                title: 'Week 1 Lock: Chiefs over Ravens!',
                selftext: 'Kansas City is way too strong at home. Taking KC.',
                author: 'RedditGuru',
                url: 'https://reddit.com/r/nfl/comments/123'
              }
            }
          ]
        }
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockRedditData });

    const result = await scrapeRedditUrl('https://reddit.com/r/nfl/comments/123.json');
    expect(result.platform).toBe('REDDIT');
    expect(result.posts.length).toBe(1);
    expect(result.posts[0].author).toBe('RedditGuru');
  });
});
