// Live 24/7 Cloud Backend deployed on Render
const CLOUD_RENDER_BACKEND = 'https://nfl-prediction-tally.onrender.com';

const API_BASE = import.meta.env.VITE_API_URL || CLOUD_RENDER_BACKEND;

export async function fetchSeasons(league = 'NFL') {
  const res = await fetch(`${API_BASE}/api/seasons?league=${league}`);
  if (!res.ok) throw new Error('Failed to fetch seasons');
  return res.json();
}

export async function fetchGames(season, week, league = 'NFL') {
  const params = new URLSearchParams();
  if (season) params.append('season', season);
  if (week) params.append('week', week);
  if (league) params.append('league', league);

  const url = `${API_BASE}/api/games?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}

export async function fetchLeaderboard(league = 'NFL') {
  const res = await fetch(`${API_BASE}/api/leaderboard?league=${league}`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export async function fetchPredictions(season, week, league = 'NFL') {
  const params = new URLSearchParams();
  if (season) params.append('season', season);
  if (week) params.append('week', week);
  if (league) params.append('league', league);

  const url = `${API_BASE}/api/predictions?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch predictions');
  return res.json();
}

export async function fetchBacktest(season = 2025, league = 'NFL') {
  const res = await fetch(`${API_BASE}/api/backtest?season=${season}&league=${league}`);
  if (!res.ok) throw new Error('Failed to fetch backtest analytics');
  return res.json();
}

export async function triggerScrape(url, platform) {
  const res = await fetch(`${API_BASE}/api/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, platform })
  });
  if (!res.ok) throw new Error('Scrape operation failed');
  return res.json();
}

export async function triggerEspnSync() {
  const res = await fetch(`${API_BASE}/api/sync-espn`);
  if (!res.ok) throw new Error('ESPN Sync failed');
  return res.json();
}

export async function triggerSyncAllSources(league = 'NFL') {
  const res = await fetch(`${API_BASE}/api/sync-all-sources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ league })
  });
  if (!res.ok) throw new Error('Auto-Scrape sync operation failed');
  return res.json();
}
