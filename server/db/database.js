import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { NFL_TEAMS } from './teamsData.js';
import { EPL_TEAMS } from './eplTeamsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_DB_PATH = path.join(__dirname, 'nfl.db');
let activeDb = null;

export function initDatabase(dbPath = DEFAULT_DB_PATH) {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('foreign_keys = OFF');
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      league TEXT DEFAULT 'NFL',
      name TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      color TEXT,
      logo_url TEXT
    );

    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      league TEXT DEFAULT 'NFL',
      espn_id TEXT UNIQUE,
      season INTEGER NOT NULL,
      week INTEGER NOT NULL,
      home_team_id TEXT REFERENCES teams(id),
      away_team_id TEXT REFERENCES teams(id),
      home_score INTEGER DEFAULT 0,
      away_score INTEGER DEFAULT 0,
      status TEXT DEFAULT 'SCHEDULED',
      winner_team_id TEXT REFERENCES teams(id),
      game_date DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      url TEXT UNIQUE NOT NULL,
      author_name TEXT,
      title TEXT,
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS predictions (
      id TEXT PRIMARY KEY,
      source_id TEXT REFERENCES sources(id),
      game_id TEXT REFERENCES games(id),
      predictor_name TEXT NOT NULL,
      picked_team_id TEXT REFERENCES teams(id),
      quote_snippet TEXT,
      confidence TEXT DEFAULT 'MEDIUM',
      status TEXT DEFAULT 'PENDING'
    );
  `);

  // Ensure league column exists if migrating from older schema
  try {
    const teamCols = db.prepare("PRAGMA table_info(teams)").all();
    if (!teamCols.some(c => c.name === 'league')) {
      db.exec("ALTER TABLE teams ADD COLUMN league TEXT DEFAULT 'NFL'");
    }
    const gameCols = db.prepare("PRAGMA table_info(games)").all();
    if (!gameCols.some(c => c.name === 'league')) {
      db.exec("ALTER TABLE games ADD COLUMN league TEXT DEFAULT 'NFL'");
    }
  } catch (err) {
    console.log('Migration check:', err.message);
  }

  activeDb = db;
  return db;
}

export function getDb(dbPath = DEFAULT_DB_PATH) {
  if (!activeDb) {
    return initDatabase(dbPath);
  }
  return activeDb;
}

export function seedTeams(dbPath = DEFAULT_DB_PATH) {
  const db = getDb(dbPath);
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO teams (id, league, name, abbreviation, color, logo_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    for (const team of NFL_TEAMS) {
      insertStmt.run(team.id, 'NFL', team.name, team.abbreviation, team.color, team.logo_url);
    }
    for (const team of EPL_TEAMS) {
      insertStmt.run(team.id, 'EPL', team.name, team.abbreviation, team.color, team.logo_url);
    }
  });

  transaction();
}

export function getTeams(league = 'NFL', dbPath = DEFAULT_DB_PATH) {
  const db = getDb(dbPath);
  return db.prepare('SELECT * FROM teams WHERE league = ? ORDER BY name ASC').all(league);
}
