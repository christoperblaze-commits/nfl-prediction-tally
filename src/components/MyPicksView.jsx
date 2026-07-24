import React, { useState, useEffect } from 'react';
import { UserCheck, Trophy, CheckCircle, Flame, Target, Zap } from 'lucide-react';
import { fetchGames } from '../services/apiClient';

export default function MyPicksView({ selectedLeague = 'NFL' }) {
  const [games, setGames] = useState([]);
  const [userPicks, setUserPicks] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadWeekGames() {
      try {
        const res = await fetchGames(2026, 1, selectedLeague);
        setGames(res.games || []);
        const storedPicks = localStorage.getItem(`userPicks_${selectedLeague}`);
        if (storedPicks) {
          setUserPicks(JSON.parse(storedPicks));
        }
      } catch (err) {
        console.error('Error loading games for user pick:', err);
      }
    }
    loadWeekGames();
  }, [selectedLeague]);

  const handlePickTeam = (gameId, teamId) => {
    const updated = { ...userPicks, [gameId]: teamId };
    setUserPicks(updated);
    localStorage.setItem(`userPicks_${selectedLeague}`, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalUserPicks = Object.keys(userPicks).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-700/80 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-gray-700/80 pb-5">
          <div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase rounded-full tracking-wider">
              🎯 My Weekly Picks & Leaderboard Competition
            </span>
            <h2 className="text-3xl font-black text-white font-outfit mt-2 tracking-tight">
              Submit Your Own {selectedLeague === 'EPL' ? 'Matchday' : 'NFL Week 1'} Picks
            </h2>
            <p className="text-sm text-gray-300 font-medium mt-1">
              Pick upcoming game winners and compete against Opta, Dimers, ESPN, and Pat McAfee on the leaderboard
            </p>
          </div>

          <div className="p-4 bg-gray-900/90 rounded-2xl border border-gray-700 flex items-center gap-4">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Submitted Picks</p>
              <p className="text-xl font-black text-white">{totalUserPicks} / {games.length} Picked</p>
            </div>
          </div>
        </div>

        {saved && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl text-xs font-bold text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Your weekly pick has been saved!
          </div>
        )}
      </div>

      {/* Matchup Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((g, idx) => {
          const userPickedTeamId = userPicks[g.id];

          return (
            <div key={g.id} className="glass-card p-6 rounded-3xl border border-gray-700/80 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-700/80 pb-3">
                <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                  Fixture #{idx + 1}
                </span>
                {userPickedTeamId ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
                    Pick Submitted
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-500/40">
                    Pending Choice
                  </span>
                )}
              </div>

              {/* Pick Selector Buttons */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Away Team Pick Button */}
                <button
                  onClick={() => handlePickTeam(g.id, g.away_team.id)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    userPickedTeamId === g.away_team.id
                      ? 'bg-blue-600/30 border-blue-400 shadow-lg shadow-blue-500/30 scale-102'
                      : 'bg-gray-900/80 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <img src={g.away_team.logo_url} alt={g.away_team.name} className="w-12 h-12 object-contain" />
                  <span className="text-sm font-extrabold text-white text-center line-clamp-1">{g.away_team.name}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    userPickedTeamId === g.away_team.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {userPickedTeamId === g.away_team.id ? '✓ Selected' : 'Select'}
                  </span>
                </button>

                {/* Home Team Pick Button */}
                <button
                  onClick={() => handlePickTeam(g.id, g.home_team.id)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    userPickedTeamId === g.home_team.id
                      ? 'bg-amber-600/30 border-amber-400 shadow-lg shadow-amber-500/30 scale-102'
                      : 'bg-gray-900/80 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <img src={g.home_team.logo_url} alt={g.home_team.name} className="w-12 h-12 object-contain" />
                  <span className="text-sm font-extrabold text-white text-center line-clamp-1">{g.home_team.name}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    userPickedTeamId === g.home_team.id ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {userPickedTeamId === g.home_team.id ? '✓ Selected' : 'Select'}
                  </span>
                </button>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
