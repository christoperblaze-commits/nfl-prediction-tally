import axios from 'axios';
import { getDb } from '../db/database.js';

const ESPN_SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

export async function fetchEspnScoreboard() {
  try {
    const response = await axios.get(ESPN_SCOREBOARD_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch ESPN Scoreboard API:', error.message);
    return { events: [] };
  }
}

export async function syncEspnGames(dbPath) {
  const db = getDb(dbPath);
  const scoreboardData = await fetchEspnScoreboard();
  const events = scoreboardData.events || [];

  const upsertGameStmt = db.prepare(`
    INSERT INTO games (id, espn_id, season, week, home_team_id, away_team_id, home_score, away_score, status, winner_team_id, game_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(espn_id) DO UPDATE SET
      home_score = excluded.home_score,
      away_score = excluded.away_score,
      status = excluded.status,
      winner_team_id = excluded.winner_team_id
  `);

  const syncedGames = [];

  for (const event of events) {
    const espnId = event.id;
    const season = event.season?.year || 2026;
    const week = event.week?.number || 1;
    const gameDate = event.date;
    const rawStatus = event.status?.type?.name;

    let status = 'SCHEDULED';
    if (rawStatus === 'STATUS_FINAL') {
      status = 'FINAL';
    } else if (rawStatus === 'STATUS_IN_PROGRESS') {
      status = 'IN_PROGRESS';
    }

    const comp = event.competitions?.[0];
    if (!comp) continue;

    const homeComp = comp.competitors.find(c => c.homeAway === 'home');
    const awayComp = comp.competitors.find(c => c.homeAway === 'away');

    if (!homeComp || !awayComp) continue;

    const homeTeamId = String(homeComp.id);
    const awayTeamId = String(awayComp.id);

    // Ensure team records exist in DB
    const insertTeamStmt = db.prepare(`
      INSERT OR IGNORE INTO teams (id, name, abbreviation, logo_url)
      VALUES (?, ?, ?, ?)
    `);
    insertTeamStmt.run(homeTeamId, homeComp.team?.name || `Team ${homeTeamId}`, homeComp.team?.abbreviation || 'NFL', homeComp.team?.logo || '');
    insertTeamStmt.run(awayTeamId, awayComp.team?.name || `Team ${awayTeamId}`, awayComp.team?.abbreviation || 'NFL', awayComp.team?.logo || '');
    const homeScore = parseInt(homeComp.score || '0', 10);
    const awayScore = parseInt(awayComp.score || '0', 10);

    let winnerTeamId = null;
    if (status === 'FINAL') {
      if (homeComp.winner) winnerTeamId = homeTeamId;
      else if (awayComp.winner) winnerTeamId = awayTeamId;
      else if (homeScore > awayScore) winnerTeamId = homeTeamId;
      else if (awayScore > homeScore) winnerTeamId = awayTeamId;
    }

    const gameRecord = {
      id: `espn_${espnId}`,
      espn_id: espnId,
      season,
      week,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      home_score: homeScore,
      away_score: awayScore,
      status,
      winner_team_id: winnerTeamId,
      game_date: gameDate
    };

    upsertGameStmt.run(
      gameRecord.id,
      gameRecord.espn_id,
      gameRecord.season,
      gameRecord.week,
      gameRecord.home_team_id,
      gameRecord.away_team_id,
      gameRecord.home_score,
      gameRecord.away_score,
      gameRecord.status,
      gameRecord.winner_team_id,
      gameRecord.game_date
    );

    syncedGames.push(gameRecord);
  }

  verifyPredictions(dbPath);
  return syncedGames;
}

export function verifyPredictions(dbPath) {
  const db = getDb(dbPath);

  // Select all pending predictions for finished games
  const pendingPredictions = db.prepare(`
    SELECT p.id, p.picked_team_id, g.winner_team_id
    FROM predictions p
    JOIN games g ON p.game_id = g.id
    WHERE g.status = 'FINAL' AND (p.status = 'PENDING' OR p.status IS NULL)
  `).all();

  const updateStatusStmt = db.prepare('UPDATE predictions SET status = ? WHERE id = ?');

  for (const pred of pendingPredictions) {
    if (!pred.winner_team_id) continue;
    const newStatus = pred.picked_team_id === pred.winner_team_id ? 'CORRECT' : 'INCORRECT';
    updateStatusStmt.run(newStatus, pred.id);
  }
}
