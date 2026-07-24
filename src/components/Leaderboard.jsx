import React, { useState } from 'react';
import { Trophy, Tv, Globe, Layers, MessageSquare } from 'lucide-react';

export default function Leaderboard({ leaderboard, predictions }) {
  const [platformFilter, setPlatformFilter] = useState('ALL');

  const filtered = leaderboard.filter(item => {
    if (platformFilter === 'REDDIT') return item.platform === 'REDDIT';
    if (platformFilter === 'YOUTUBE') return item.platform === 'YOUTUBE';
    if (platformFilter === 'WEB') return item.platform === 'WEB';
    return true;
  });

  const getPlatformIcon = (platform) => {
    if (platform === 'REDDIT') return <span className="text-orange-400 font-bold text-xs bg-orange-500/20 px-2.5 py-1 rounded-full border border-orange-500/30">Reddit</span>;
    if (platform === 'YOUTUBE') return <span className="text-red-400 font-bold text-xs bg-red-500/20 px-2.5 py-1 rounded-full border border-red-500/30 flex items-center gap-1.5"><Tv className="w-3.5 h-3.5"/> YouTube</span>;
    return <span className="text-blue-300 font-bold text-xs bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-400/30 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5"/> Web</span>;
  };

  const getPredictorSnippet = (name) => {
    const found = predictions.find(p => p.predictor_name === name);
    return found ? found.quote_snippet : null;
  };

  const getMostPickedTeam = (name) => {
    const predictorPicks = predictions.filter(p => p.predictor_name === name);
    if (predictorPicks.length === 0) return 'N/A';
    
    const countMap = {};
    for (const p of predictorPicks) {
      countMap[p.picked_team_name] = (countMap[p.picked_team_name] || 0) + 1;
    }
    let topTeam = 'N/A';
    let max = 0;
    for (const [team, cnt] of Object.entries(countMap)) {
      if (cnt > max) {
        max = cnt;
        topTeam = team;
      }
    }
    return topTeam;
  };

  return (
    <section className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900/90 p-6 rounded-3xl border border-gray-700/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 font-outfit">
            <Layers className="w-6 h-6 text-amber-400" /> Source Prediction Tally Leaderboard
          </h2>
          <p className="text-sm text-gray-300 font-medium mt-1">Ranked by total volume of scraped predictions across platforms</p>
        </div>

        {/* Filter */}
        <div className="flex bg-gray-800 p-1.5 rounded-xl border border-gray-700 text-xs">
          <button
            onClick={() => setPlatformFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-bold transition-all text-xs ${
              platformFilter === 'ALL' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            All Outlets
          </button>
          <button
            onClick={() => setPlatformFilter('REDDIT')}
            className={`px-4 py-2 rounded-lg font-bold transition-all text-xs ${
              platformFilter === 'REDDIT' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            Reddit
          </button>
          <button
            onClick={() => setPlatformFilter('YOUTUBE')}
            className={`px-4 py-2 rounded-lg font-bold transition-all text-xs ${
              platformFilter === 'YOUTUBE' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setPlatformFilter('WEB')}
            className={`px-4 py-2 rounded-lg font-bold transition-all text-xs ${
              platformFilter === 'WEB' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            Web Blogs
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-3xl border border-gray-700/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-200">
            <thead className="bg-gray-900 text-xs uppercase font-black text-gray-300 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Predictor / Source Channel</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Most Picked Team</th>
                <th className="px-6 py-4 text-right">Total Predictions Scraped</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-300 font-bold">
                    No prediction sources found for this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const snippet = getPredictorSnippet(item.predictor_name);
                  const topTeam = getMostPickedTeam(item.predictor_name);

                  return (
                    <tr key={idx} className="hover:bg-gray-800/60 transition-colors">
                      
                      {/* Rank */}
                      <td className="px-6 py-4 font-black text-white text-base">
                        <span className="text-gray-400">#{idx + 1}</span>
                      </td>

                      {/* Predictor Name */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-white text-base">{item.predictor_name}</div>
                        {snippet && (
                          <p className="text-xs text-gray-300 italic line-clamp-1 mt-0.5 font-normal">"{snippet}"</p>
                        )}
                      </td>

                      {/* Platform Tag */}
                      <td className="px-6 py-4">
                        {getPlatformIcon(item.platform)}
                      </td>

                      {/* Most Picked Team */}
                      <td className="px-6 py-4 font-extrabold text-amber-400 text-base">
                        {topTeam}
                      </td>

                      {/* Total Tally Count Badge */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 font-black px-4 py-1.5 rounded-xl border border-blue-400/30 text-base">
                          <MessageSquare className="w-4 h-4" />
                          {item.total_picks} Picks
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
