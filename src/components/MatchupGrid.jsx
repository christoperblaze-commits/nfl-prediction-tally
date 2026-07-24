import React, { useState } from 'react';
import MatchupCard from './MatchupCard';
import { Filter, Sparkles } from 'lucide-react';

export default function MatchupGrid({ games, onSelectGame }) {
  const [filter, setFilter] = useState('ALL'); // ALL, SCHEDULED, FINAL

  const filteredGames = games.filter(g => {
    if (filter === 'SCHEDULED') return g.status === 'SCHEDULED';
    if (filter === 'FINAL') return g.status === 'FINAL';
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-800/60 p-4 rounded-2xl border border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> NFL Matchups & Crowd Tally
          </h2>
          <p className="text-xs text-gray-400">Click any matchup card to view detailed prediction quotes & sources</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex bg-dark-900 p-1 rounded-xl border border-gray-800 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({games.length})
            </button>
            <button
              onClick={() => setFilter('SCHEDULED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === 'SCHEDULED' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming ({games.filter(g => g.status === 'SCHEDULED').length})
            </button>
            <button
              onClick={() => setFilter('FINAL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === 'FINAL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Final ({games.filter(g => g.status === 'FINAL').length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {filteredGames.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-gray-800">
          <p className="text-gray-400">No matchups found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredGames.map(game => (
            <MatchupCard key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>
      )}
    </section>
  );
}
