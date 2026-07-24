import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import express from 'express';
import apiRouter from '../server/routes/api.js';
import { initDatabase, seedTeams } from '../server/db/database.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const TEST_DB_PATH = path.join(__dirname, '../server/db/test_season_api.db');

describe('Express REST API Endpoints with Season & Week Filtering', () => {
  let app;

  beforeEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    const db = initDatabase(TEST_DB_PATH);
    seedTeams(TEST_DB_PATH);

    // Insert 2026 Game
    db.prepare(`
      INSERT INTO games (id, espn_id, season, week, home_team_id, away_team_id, home_score, away_score, status, winner_team_id, game_date)
      VALUES ('g2026', 'espn2026', 2026, 1, '12', '33', 0, 0, 'SCHEDULED', NULL, '2026-09-10T20:20:00Z')
    `).run();

    // Insert 2025 Game Week 1
    db.prepare(`
      INSERT INTO games (id, espn_id, season, week, home_team_id, away_team_id, home_score, away_score, status, winner_team_id, game_date)
      VALUES ('g2025_w1', 'espn2025_w1', 2025, 1, '12', '33', 27, 20, 'FINAL', '12', '2025-09-05T20:20:00Z')
    `).run();

    // Insert 2025 Game Week 2
    db.prepare(`
      INSERT INTO games (id, espn_id, season, week, home_team_id, away_team_id, home_score, away_score, status, winner_team_id, game_date)
      VALUES ('g2025_w2', 'espn2025_w2', 2025, 2, '12', '4', 26, 25, 'FINAL', '12', '2025-09-15T16:25:00Z')
    `).run();

    app = express();
    app.use(express.json());
    app.use('/api', (req, res, next) => {
      req.dbPath = TEST_DB_PATH;
      next();
    }, apiRouter);
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  it('GET /api/seasons returns list of seasons and available weeks', async () => {
    const server = app.listen(0);
    const port = server.address().port;

    const response = await axios.get(`http://localhost:${port}/api/seasons`);
    expect(response.status).toBe(200);
    expect(response.data.seasons.length).toBe(2);

    const s2025 = response.data.seasons.find(s => s.season === 2025);
    expect(s2025).toBeDefined();
    expect(s2025.weeks).toEqual([1, 2]);

    server.close();
  });

  it('GET /api/games?season=2025&week=1 returns only 2025 Week 1 games', async () => {
    const server = app.listen(0);
    const port = server.address().port;

    const response = await axios.get(`http://localhost:${port}/api/games?season=2025&week=1`);
    expect(response.status).toBe(200);
    expect(response.data.games.length).toBe(1);
    expect(response.data.games[0].id).toBe('g2025_w1');

    server.close();
  });
});
