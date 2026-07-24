import React, { useState } from 'react';
import { Users, Trophy, Plus, LogIn, Share2, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function FriendsPool({ selectedLeague = 'NFL' }) {
  const [leagueCode, setLeagueCode] = useState('ORACLE-8821');
  const [userJoined, setUserJoined] = useState(true);
  const [newRoomName, setNewRoomName] = useState('');
  const [copied, setCopied] = useState(false);

  // Mock Friends League Leaderboard
  const members = [
    { rank: 1, name: 'You (Host)', points: 42, correct: 34, total: 44, winPct: 77, badge: '👑 League Leader' },
    { rank: 2, name: 'Opta AI Supercomputer', points: 40, correct: 32, total: 44, winPct: 73, badge: '🤖 AI Model' },
    { rank: 3, name: 'Alex_Sharp', points: 38, correct: 30, total: 44, winPct: 68, badge: '⚡ Friend' },
    { rank: 4, name: 'ESPN Expert Panel', points: 36, correct: 29, total: 44, winPct: 66, badge: '📺 Media' },
    { rank: 5, name: 'Chris_B', points: 34, correct: 27, total: 44, winPct: 61, badge: '⚡ Friend' },
    { rank: 6, name: 'Dave_Pickem', points: 30, correct: 24, total: 44, winPct: 55, badge: '⚡ Friend' },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(leagueCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-700/80 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-gray-700/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-black uppercase rounded-full tracking-wider">
                👥 Private Friends League & Pool
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit mt-2 tracking-tight">
              Friends Pick'em Tournament
            </h2>
            <p className="text-sm text-gray-300 font-medium mt-1">
              Compete against your friends, co-workers, Opta AI, and ESPN experts in weekly pick'em predictions
            </p>
          </div>

          {/* Share League Room Code */}
          <div className="bg-gray-900/90 p-3.5 rounded-2xl border border-gray-700/90 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Invite Code</p>
              <p className="text-lg font-black text-amber-400 font-mono tracking-widest">{leagueCode}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Share Code'}</span>
            </button>
          </div>
        </div>

        {/* Room Switcher / Create New Pool Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300">Active Pool:</span>
            <span className="px-3.5 py-1.5 bg-blue-600/30 text-blue-300 font-black text-xs rounded-xl border border-blue-500/40">
              🏈 2026 Office Sharp Pick'em Pool
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter Room Code or Name..."
              className="bg-gray-800 border border-gray-700 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 w-full sm:w-56"
            />
            <button
              onClick={() => { if (newRoomName) { setLeagueCode(newRoomName.toUpperCase()); setNewRoomName(''); } }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer"
            >
              Join / Create
            </button>
          </div>
        </div>
      </div>

      {/* Friends Leaderboard Standings Table */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-700/80 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-700/80 pb-4">
          <h3 className="text-xl font-black text-white font-outfit flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Friends vs AI Leaderboard Standings
          </h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
            Week 1 Standings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black uppercase text-gray-400 border-b border-gray-800 pb-2">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Competitor</th>
                <th className="py-3 px-3 text-center">Correct Picks</th>
                <th className="py-3 px-3 text-center">Accuracy %</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm font-medium">
              {members.map((m) => (
                <tr key={m.name} className={`hover:bg-gray-800/40 transition-colors ${m.name.includes('You') ? 'bg-blue-950/40 font-bold' : ''}`}>
                  <td className="py-4 px-3 font-black text-amber-400">
                    #{m.rank}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white">{m.name}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                        {m.badge}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center font-bold text-gray-200">
                    <span className="text-emerald-400 font-extrabold">{m.correct}</span> / {m.total}
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      m.winPct >= 70 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-300'
                    }`}>
                      {m.winPct}%
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right font-bold text-xs text-gray-400">
                    {m.rank === 1 ? '🥇 Winner' : `${m.total - m.correct} Losses`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
