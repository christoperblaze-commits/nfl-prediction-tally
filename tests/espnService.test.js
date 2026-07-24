import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initDatabase, seedTeams } from '../server/db/database.js';
import { syncEspnGames, verifyPredictions } from '../server/services/espnService.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

vi.mock('axios');

const TEST_DB_PATH = path.join(__dirname, '../server/db/test_espn.db');

describe('ESPN Scoreboard Service & Verifier', () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    const db = initDatabase(TEST_DB_PATH);
    seedTeams(TEST_DB_PATH);
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    vi.clearAllMocks();
  });

  it('should parse ESPN scoreboard response and sync games into DB', async () => {
    const mockEspnData = {
      events: [
        {
          id: '401547385',
          date: '2026-09-10T20:20:00Z',
          season: { year: 2026 },
          week: { number: 1 },
          status: { type: { name: 'STATUS_FINAL' } },
          competitions: [
            {
              competitors: [
                { id: '12', homeAway: 'home', score: '27', winner: true, team: { name: 'Chiefs', abbreviation: 'KC' } },
                { id: '33', homeAway: 'away', score: '20', winner: false, team: { name: 'Ravens', abbreviation: 'BAL' } }
              ]
            }
          ]
        }
      ]
    };

    axios.get.mockResolvedValueOnce({ data: mockEspnData });

    const syncedGames = await syncEspnGames(TEST_DB_PATH);
    expect(syncedGames.length).toBe(1);
    expect(syncedGames[0].espn_id).toBe('401547385');
    expect(syncedGames[0].home_score).toBe(27);
    expect(syncedGames[0].away_score).toBe(20);
    expect(syncedGames[0].status).toBe('FINAL');
    expect(syncedGames[0].winner_team_id).toBe('12');
  });

  it('should evaluate predictions as CORRECT or INCORRECT based on game winner', () => {
    const db = initDatabase(TEST_DB_PATH);

    // Insert completed game
    db.prepare(`
      INSERT INTO games (id, espn_id, season, week, home_team_id, away_team_id, home_score, away_score, status, winner_team_id, game_date)
      VALUES ('g1', 'espn1', 2026, 1, '12', '33', 27, 20, 'FINAL', '12', '2026-09-10')
    `).run();

    // Insert source
    db.prepare(`
      INSERT INTO sources (id, platform, url, author_name, title)
      VALUES ('s1', 'REDDIT', 'https://reddit.com/r/nfl/comments/123', 'FootballFan99', 'Week 1 Picks')
    `).run();

    // Insert predictions
    db.prepare(`
      INSERT INTO predictions (id, source_id, game_id, predictor_name, picked_team_id, status)
      VALUES ('p1', 's1', 'g1', 'FootballFan99', '12', 'PENDING')
    `).run();

    db.prepare(`
      INSERT INTO predictions (id, source_id, game_id, predictor_name, picked_team_id, status)
      VALUES ('p2', 's1', 'g1', 'Hater22', '33', 'PENDING')
    `).run();

    verifyPredictions(TEST_DB_PATH);

    const p1 = db.prepare('SELECT status FROM predictions WHERE id = ?').get('p1');
    const p2 = db.prepare('SELECT status FROM predictions WHERE id = ?').get('p2');

    expect(p1.status).toBe('CORRECT');
    expect(p2.status).toBe('INCORRECT');
  });
});
