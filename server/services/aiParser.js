import { NFL_TEAMS } from '../db/teamsData.js';

// Alias dictionary for high-precision entity resolution
const TEAM_ALIASES = {
  'chiefs': '12', 'kc': '12', 'kansas city': '12',
  'bills': '2', 'buf': '2', 'buffalo': '2',
  'eagles': '21', 'phi': '21', 'philly': '21', 'philadelphia': '21',
  '49ers': '25', 'niners': '25', 'sf': '25', 'san francisco': '25',
  'ravens': '33', 'bal': '33', 'baltimore': '33',
  'cowboys': '6', 'dal': '6', 'dallas': '6',
  'packers': '9', 'gb': '9', 'green bay': '9',
  'lions': '8', 'det': '8', 'detroit': '8',
  'bengals': '4', 'cin': '4', 'cincinnati': '4',
  'dolphins': '15', 'mia': '15', 'miami': '15',
  'texans': '34', 'hou': '34', 'houston': '34',
  'steelers': '23', 'pit': '23', 'pittsburgh': '23',
  'chargers': '24', 'lac': '24', 'la chargers': '24',
  'rams': '14', 'lar': '14', 'la rams': '14',
  'jets': '20', 'nyj': '20', 'ny jets': '20',
  'giants': '19', 'nyg': '19', 'ny giants': '19',
  'seahawks': '26', 'sea': '26', 'seattle': '26',
  'falcons': '1', 'atl': '1', 'atlanta': '1',
  'bears': '3', 'chi': '3', 'chicago': '3',
  'browns': '5', 'cle': '5', 'cleveland': '5',
  'broncos': '7', 'den': '7', 'denver': '7',
  'titans': '10', 'ten': '10', 'tennessee': '10',
  'colts': '11', 'ind': '11', 'indianapolis': '11',
  'raiders': '13', 'lv': '13', 'vegas': '13',
  'vikings': '16', 'min': '16', 'minnesota': '16',
  'patriots': '17', 'ne': '17', 'pats': '17', 'new england': '17',
  'saints': '18', 'no': '18', 'new orleans': '18',
  'cardinals': '22', 'ari': '22', 'arizona': '22',
  'buccaneers': '27', 'tb': '27', 'bucs': '27', 'tampa bay': '27',
  'commanders': '28', 'was': '28', 'washington': '28',
  'panthers': '29', 'car': '29', 'carolina': '29',
  'jaguars': '30', 'jax': '30', 'jags': '30', 'jacksonville': '30'
};

export function resolveTeamId(rawName) {
  if (!rawName) return null;
  const normalized = rawName.toLowerCase().trim();
  if (TEAM_ALIASES[normalized]) {
    return TEAM_ALIASES[normalized];
  }
  for (const [alias, id] of Object.entries(TEAM_ALIASES)) {
    if (normalized.includes(alias)) {
      return id;
    }
  }
  return null;
}

export function parsePredictionsFromText(text, predictorName = 'Anonymous') {
  if (!text) return [];
  const predictions = [];
  const lines = text.split(/[\n.!?,;]+/);

  const actionKeywords = [
    'picking', 'lock', 'locking', 'takes it', 'takes', 'beat', 'over', 'win', 'winning', 'taking', 'got'
  ];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const hasAction = actionKeywords.some(kw => lowerLine.includes(kw));

    if (!hasAction) continue;

    // Search for team mentions in line
    const foundTeams = [];
    for (const [alias, id] of Object.entries(TEAM_ALIASES)) {
      // Use regex boundary to avoid partial word match (e.g. "no" in "now")
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(line)) {
        const teamObj = NFL_TEAMS.find(t => t.id === id);
        if (teamObj && !foundTeams.some(t => t.id === teamObj.id)) {
          foundTeams.push(teamObj);
        }
      }
    }

    if (foundTeams.length >= 1) {
      // Picked team is usually the first team mentioned with action keyword
      const pickedTeam = foundTeams[0];
      const opponentTeam = foundTeams[1] || null;

      // Avoid duplicates in same sentence
      if (!predictions.some(p => p.picked_team_id === pickedTeam.id)) {
        predictions.push({
          predictor_name: predictorName,
          picked_team_id: pickedTeam.id,
          picked_team_name: pickedTeam.name,
          opponent_team_id: opponentTeam ? opponentTeam.id : null,
          quote_snippet: line.trim().substring(0, 140),
          confidence: lowerLine.includes('lock') || lowerLine.includes('definitely') ? 'HIGH' : 'MEDIUM'
        });
      }
    }
  }

  return predictions;
}
