import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDatabase, getDb, seedTeams, getTeams } from '../server/db/database.js';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = path.join(__dirname, '../server/db/test_nfl.db');

describe('Database & Seeding Tests', () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  it('should initialize database tables cleanly', () => {
    const db = initDatabase(TEST_DB_PATH);
    expect(db).toBeDefined();

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);

    expect(tableNames).toContain('teams');
    expect(tableNames).toContain('games');
    expect(tableNames).toContain('sources');
    expect(tableNames).toContain('predictions');
  });

  it('should seed exactly 32 NFL teams with logos and abbreviations', () => {
    initDatabase(TEST_DB_PATH);
    seedTeams(TEST_DB_PATH);

    const teams = getTeams('NFL', TEST_DB_PATH);
    expect(teams.length).toBe(32);

    const chiefs = teams.find(t => t.abbreviation === 'KC');
    expect(chiefs).toBeDefined();
    expect(chiefs.name).toBe('Kansas City Chiefs');
    expect(chiefs.logo_url).toBeTruthy();
  });
});
