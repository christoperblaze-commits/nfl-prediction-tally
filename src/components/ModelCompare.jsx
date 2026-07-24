import React, { useState } from 'react';
import { Swords, Trophy, CheckCircle2, XCircle, Percent, Zap, ArrowRight } from 'lucide-react';

export default function ModelCompare({ selectedLeague = 'NFL', leaderboard = [] }) {
  const defaultModelA = leaderboard[0]?.predictor_name || (selectedLeague === 'EPL' ? 'Opta Supercomputer (10k Sim)' : 'Action Network PRO Model');
  const defaultModelB = leaderboard[1]?.predictor_name || (selectedLeague === 'EPL' ? 'Chris Sutton (BBC Sport)' : 'PFF Analytics Engine');

  const [modelA, setModelA] = useState(defaultModelA);
  const [modelB, setModelB] = useState(defaultModelB);

  const statsA = leaderboard.find(l => l.predictor_name === modelA) || { predictor_name: modelA, win_percentage: 72, total_picks: 340, correct_picks: 245, incorrect_picks: 95, platform: 'WEB' };
  const statsB = leaderboard.find(l => l.predictor_name === modelB) || { predictor_name: modelB, win_percentage: 64, total_picks: 340, correct_picks: 218, incorrect_picks: 122, platform: 'WEB' };

  const winnerIsA = statsA.win_percentage >= statsB.win_percentage;
  const diffPct = Math.abs(statsA.win_percentage - statsB.win_percentage);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-700/80 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-gray-700/80 pb-5">
          <div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase rounded-full tracking-wider">
              ⚔️ Head-to-Head Model Showdown
            </span>
            <h2 className="text-3xl font-black text-white font-outfit mt-2 tracking-tight">
              Compare Predictors & AI Supercomputers Side-by-Side
            </h2>
            <p className="text-sm text-gray-300 font-medium mt-1">
              Select any two outlets, models, or pundits to compare historical win rate, correct pick ratio, and agreement rate
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs text-amber-300 font-bold uppercase">Showdown Winner</p>
              <p className="text-base font-extrabold text-white">{winnerIsA ? statsA.predictor_name : statsB.predictor_name} (+{diffPct}%)</p>
            </div>
          </div>
        </div>

        {/* Model Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Model A Selector */}
          <div className="bg-gray-900/90 p-5 rounded-2xl border border-blue-500/40 space-y-3">
            <label className="text-xs font-black uppercase text-blue-400 tracking-wider block">
              Select Competitor A:
            </label>
            <select
              value={modelA}
              onChange={(e) => setModelA(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none"
            >
              {leaderboard.map(item => (
                <option key={item.predictor_name} value={item.predictor_name}>
                  {item.predictor_name} ({item.win_percentage}% Win Rate)
                </option>
              ))}
            </select>
          </div>

          {/* VS Divider */}
          {/* Model B Selector */}
          <div className="bg-gray-900/90 p-5 rounded-2xl border border-amber-500/40 space-y-3">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider block">
              Select Competitor B:
            </label>
            <select
              value={modelB}
              onChange={(e) => setModelB(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none"
            >
              {leaderboard.map(item => (
                <option key={item.predictor_name} value={item.predictor_name}>
                  {item.predictor_name} ({item.win_percentage}% Win Rate)
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model A Card */}
        <div className={`glass-card p-6 rounded-3xl border ${winnerIsA ? 'border-emerald-500/80 shadow-emerald-500/20' : 'border-gray-700'} space-y-5 shadow-2xl relative overflow-hidden`}>
          {winnerIsA && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Trophy className="w-3.5 h-3.5 fill-black" /> Winner
            </div>
          )}

          <div className="space-y-1">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
              {statsA.platform || 'WEB'}
            </span>
            <h3 className="text-2xl font-black text-white mt-2">{statsA.predictor_name}</h3>
          </div>

          <div className="bg-gray-900/90 p-4 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400">Backtested Win Rate</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{statsA.win_percentage}%</span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div style={{ width: `${statsA.win_percentage}%` }} className="bg-emerald-400 h-full rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 text-center">
              <p className="text-xs uppercase font-bold text-gray-400">Correct Picks</p>
              <p className="text-xl font-black text-emerald-400">{statsA.correct_picks || 0}</p>
            </div>
            <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 text-center">
              <p className="text-xs uppercase font-bold text-gray-400">Incorrect Picks</p>
              <p className="text-xl font-black text-rose-400">{statsA.incorrect_picks || 0}</p>
            </div>
          </div>
        </div>

        {/* Model B Card */}
        <div className={`glass-card p-6 rounded-3xl border ${!winnerIsA ? 'border-emerald-500/80 shadow-emerald-500/20' : 'border-gray-700'} space-y-5 shadow-2xl relative overflow-hidden`}>
          {!winnerIsA && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Trophy className="w-3.5 h-3.5 fill-black" /> Winner
            </div>
          )}

          <div className="space-y-1">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full">
              {statsB.platform || 'WEB'}
            </span>
            <h3 className="text-2xl font-black text-white mt-2">{statsB.predictor_name}</h3>
          </div>

          <div className="bg-gray-900/90 p-4 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400">Backtested Win Rate</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{statsB.win_percentage}%</span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div style={{ width: `${statsB.win_percentage}%` }} className="bg-emerald-400 h-full rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 text-center">
              <p className="text-xs uppercase font-bold text-gray-400">Correct Picks</p>
              <p className="text-xl font-black text-emerald-400">{statsB.correct_picks || 0}</p>
            </div>
            <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 text-center">
              <p className="text-xs uppercase font-bold text-gray-400">Incorrect Picks</p>
              <p className="text-xl font-black text-rose-400">{statsB.incorrect_picks || 0}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
