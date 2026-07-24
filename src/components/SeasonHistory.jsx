import React, { useState, useEffect } from 'react';
import { Calendar, Flame, History, ExternalLink, Quote, MessageSquare } from 'lucide-react';
import { fetchSeasons, fetchGames } from '../services/apiClient';

export default function SeasonHistory({ onSelectGame }) {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeasons() {
      try {
        const res = await fetchSeasons();
        setSeasons(res.seasons || []);
        const pastSeason = res.seasons.find(s => s.season === 2025) || res.seasons[0];
        if (pastSeason) {
          setSelectedSeason(pastSeason.season);
          if (pastSeason.weeks.length > 0) {
            setSelectedWeek(pastSeason.weeks[0]);
          }
        }
      } catch (err) {
        console.error('Error loading seasons:', err);
      }
    }
    loadSeasons();
  }, []);

  useEffect(() => {
    if (!selectedSeason || !selectedWeek) return;

    async function loadWeekGames() {
      setLoading(true);
      try {
        const res = await fetchGames(selectedSeason, selectedWeek);
        setGames(res.games || []);
      } catch (err) {
        console.error('Error loading week games:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWeekGames();
  }, [selectedSeason, selectedWeek]);

  const activeSeasonData = seasons.find(s => s.season === selectedSeason);
  const availableWeeks = activeSeasonData ? activeSeasonData.weeks : [];

  let totalPredictions = 0;
  for (const g of games) {
    const preds = g.predictions || [];
    totalPredictions += preds.length;
  }

  const getWeekLabel = (w) => {
    if (w === 19) return 'Wildcard';
    if (w === 20) return 'Divisional';
    if (w === 21) return 'Conference';
    if (w === 22) return 'Super Bowl';
    return `Week ${w}`;
  };

  return (
    <section className="space-y-6">
      
      {/* Title & Season Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-800/60 p-5 rounded-2xl border border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-outfit">
            <History className="w-5 h-5 text-amber-400" /> Historical Season Prediction Tally Archive
          </h2>
          <p className="text-xs text-gray-400">Review week-by-week community prediction tallies across past seasons</p>
        </div>

        {/* Season Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Season:</span>
          <select
            value={selectedSeason}
            onChange={(e) => {
              const s = parseInt(e.target.value, 10);
              setSelectedSeason(s);
              const sData = seasons.find(item => item.season === s);
              if (sData && sData.weeks.length > 0) {
                setSelectedWeek(sData.weeks[0]);
              }
            }}
            className="bg-dark-900 border border-gray-700 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {seasons.map(s => (
              <option key={s.season} value={s.season}>{s.season} Season</option>
            ))}
          </select>
        </div>
      </div>

      {/* Week Sub-Tabs Navigation */}
      <div className="glass-panel p-2 rounded-2xl border border-gray-800 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {availableWeeks.map(w => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                selectedWeek === w
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              {getWeekLabel(w)}
            </button>
          ))}
        </div>
      </div>

      {/* Week Overview Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl border border-gray-800 flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Selected Archive View</p>
            <p className="text-sm font-extrabold text-white">{selectedSeason} • {getWeekLabel(selectedWeek)}</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-gray-800 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Total Week Predictions</p>
            <p className="text-sm font-extrabold text-white">{totalPredictions} Picks Tallied</p>
          </div>
        </div>
      </div>

      {/* Week Matchup & Predictions Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          Loading {selectedSeason} {getWeekLabel(selectedWeek)} predictions...
        </div>
      ) : games.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-gray-800 text-gray-400">
          No prediction records found for this week in the historical archive.
        </div>
      ) : (
        <div className="space-y-6">
          {games.map(game => (
            <div key={game.id} className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
              
              {/* Game Tally Header */}
              <div className="bg-dark-800/90 p-4 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Away Team */}
                <div className="flex items-center gap-3">
                  <img src={game.away_team.logo_url} alt="" className="w-10 h-10 object-contain bg-dark-900 p-1 rounded-full border border-gray-800" />
                  <div>
                    <h4 className="font-bold text-white text-base">{game.away_team.name}</h4>
                    <span className="text-xs text-blue-400 font-bold">{game.away_pick_percentage}% Picked ({game.away_pick_count} votes)</span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="px-3 py-1 bg-dark-900 text-xs font-black text-amber-400 rounded-full border border-gray-800 uppercase flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> {game.total_predictions} Total Predictions
                  </span>
                </div>

                {/* Home Team */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <h4 className="font-bold text-white text-base">{game.home_team.name}</h4>
                    <span className="text-xs text-amber-400 font-bold">{game.home_pick_percentage}% Picked ({game.home_pick_count} votes)</span>
                  </div>
                  <img src={game.home_team.logo_url} alt="" className="w-10 h-10 object-contain bg-dark-900 p-1 rounded-full border border-gray-800" />
                </div>

              </div>

              {/* Split Bar */}
              <div className="px-4 pt-3 pb-1 bg-dark-900/60">
                <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${game.away_pick_percentage}%` }} className="h-full bg-blue-500" />
                  <div style={{ width: `${game.home_pick_percentage}%` }} className="h-full bg-amber-500" />
                </div>
              </div>

              {/* Scraped Predictions List */}
              <div className="p-4 space-y-3 bg-dark-900/40">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Scraped Predictions for this Matchup ({game.predictions.length})
                </h5>

                {game.predictions.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No predictions logged for this specific game.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {game.predictions.map(pred => (
                      <div key={pred.id} className="bg-dark-800/90 p-3.5 rounded-xl border border-gray-800 flex flex-col justify-between space-y-2">
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{pred.predictor_name}</span>
                            <span className="text-[10px] text-gray-400 bg-dark-900 px-2 py-0.5 rounded-full border border-gray-800">{pred.platform}</span>
                          </div>
                        </div>

                        {/* Picked Team & Quote */}
                        <div className="text-xs space-y-1">
                          <p className="text-gray-300 font-semibold">
                            Picked: <span className="text-amber-400 font-bold">{pred.picked_team_name}</span>
                          </p>
                          <div className="flex items-start gap-1.5 text-[11px] text-gray-400 bg-dark-900/80 p-2 rounded-lg italic">
                            <Quote className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                            <span>"{pred.quote_snippet}"</span>
                          </div>
                        </div>

                        {/* Source URL */}
                        {pred.source_url && (
                          <a
                            href={pred.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 self-end font-medium"
                          >
                            Source Link <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
}
