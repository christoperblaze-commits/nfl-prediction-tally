import React from 'react';
import { Calendar, CheckCircle2, Clock, Flame, MessageSquare } from 'lucide-react';

export default function MatchupCard({ game, onSelect }) {
  const homePct = game.home_pick_percentage;
  const awayPct = game.away_pick_percentage;

  const isFinal = game.status === 'FINAL';
  const homeIsWinner = isFinal && game.winner_team_id === game.home_team.id;
  const awayIsWinner = isFinal && game.winner_team_id === game.away_team.id;

  const formattedDate = new Date(game.game_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      onClick={() => onSelect && onSelect(game)}
      className="glass-card rounded-2xl p-5 hover:cursor-pointer transition-all duration-300 relative overflow-hidden group border border-gray-800 hover:border-blue-500/40"
    >
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

      {/* Top Status Header */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-3 border-b border-gray-800/80">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>Week {game.week} • {formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold">
          {isFinal ? (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> FINAL
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Clock className="w-3 h-3" /> UPCOMING
            </span>
          )}
        </div>
      </div>

      {/* Matchup Team Display */}
      <div className="grid grid-cols-5 items-center gap-2 mb-6">
        
        {/* Away Team */}
        <div className="col-span-2 flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full p-2 bg-dark-900/90 border ${awayIsWinner ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-gray-800'} mb-2 shadow-inner transition-transform group-hover:scale-105`}>
            <img src={game.away_team.logo_url} alt={game.away_team.name} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-sm font-bold text-white line-clamp-1">{game.away_team.name}</h3>
          <span className="text-xs text-gray-400">{game.away_team.abbreviation} (Away)</span>
          {isFinal && (
            <span className={`text-xl font-extrabold mt-1 ${awayIsWinner ? 'text-amber-400' : 'text-gray-400'}`}>
              {game.away_score}
            </span>
          )}
        </div>

        {/* VS / Score Divider */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest bg-dark-900 px-2.5 py-1 rounded-full border border-gray-800">
            VS
          </span>
        </div>

        {/* Home Team */}
        <div className="col-span-2 flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full p-2 bg-dark-900/90 border ${homeIsWinner ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-gray-800'} mb-2 shadow-inner transition-transform group-hover:scale-105`}>
            <img src={game.home_team.logo_url} alt={game.home_team.name} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-sm font-bold text-white line-clamp-1">{game.home_team.name}</h3>
          <span className="text-xs text-gray-400">{game.home_team.abbreviation} (Home)</span>
          {isFinal && (
            <span className={`text-xl font-extrabold mt-1 ${homeIsWinner ? 'text-amber-400' : 'text-gray-400'}`}>
              {game.home_score}
            </span>
          )}
        </div>
      </div>

      {/* Crowd & Expert Consensus Pick Bar */}
      <div className="bg-dark-900/80 rounded-xl p-3 border border-gray-800/90">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-semibold text-gray-300 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Consensus Pick
          </span>
          <span className="text-gray-400 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> {game.total_predictions} Total Predictions
          </span>
        </div>

        {/* Split Bar */}
        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
          <div 
            style={{ width: `${awayPct}%` }} 
            className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-500"
            title={`${game.away_team.abbreviation} ${awayPct}%`}
          />
          <div 
            style={{ width: `${homePct}%` }} 
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
            title={`${game.home_team.abbreviation} ${homePct}%`}
          />
        </div>

        {/* Percentage Labels */}
        <div className="flex justify-between text-[11px] font-bold mt-1.5">
          <span className="text-blue-400">{game.away_team.abbreviation} {awayPct}%</span>
          <span className="text-amber-400">{game.home_team.abbreviation} {homePct}%</span>
        </div>
      </div>

    </div>
  );
}
