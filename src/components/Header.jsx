import React from 'react';
import { Trophy, Layers, RefreshCw, Zap, Calendar, Activity, Globe } from 'lucide-react';

export default function Header({ selectedLeague, setSelectedLeague, totalPredictions, totalSources, activeTab, setActiveTab, onRefresh, syncing }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-700/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo, Title & League Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/30">
              <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-outfit">Gridiron & Pitch Oracle</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                  {selectedLeague === 'EPL' ? 'EPL Premier League' : selectedLeague === 'NFL' ? 'NFL Football' : 'All Sports'}
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium">Multi-Sport Crowd & Source Prediction Aggregator</p>
            </div>
          </div>

          {/* League Selector Switcher Bar */}
          <div className="flex bg-gray-900/90 p-1.5 rounded-2xl border border-gray-700">
            <button
              onClick={() => setSelectedLeague('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedLeague === 'ALL'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" /> All Sports
            </button>
            <button
              onClick={() => setSelectedLeague('NFL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedLeague === 'NFL'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🏈 NFL
            </button>
            <button
              onClick={() => setSelectedLeague('EPL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedLeague === 'EPL'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              ⚽ Premier League
            </button>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="hidden lg:flex items-center gap-5 bg-gray-900/90 px-5 py-2 rounded-2xl border border-gray-700/80">
          <div className="flex items-center gap-2.5 border-r border-gray-700 pr-5">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Scraped</p>
              <p className="text-sm font-extrabold text-white">{totalPredictions} Picks</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Outlets</p>
              <p className="text-sm font-extrabold text-blue-400">{totalSources} Outlets</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <nav className="flex bg-gray-900/90 p-1.5 rounded-2xl border border-gray-700/80">
            <button
              onClick={() => setActiveTab('weektally')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'weektally'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> {selectedLeague === 'EPL' ? 'Matchday' : selectedLeague === 'NFL' ? 'NFL Week' : 'Matchups'}
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'compare'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              ⚔️ Compare
            </button>
            <button
              onClick={() => setActiveTab('mypicks')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'mypicks'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              🎯 My Picks
            </button>
            <button
              onClick={() => setActiveTab('backtest')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'backtest'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              🧪 Backtest
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              Source Tallies
            </button>
            <button
              onClick={() => setActiveTab('scraper')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'scraper'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              Scraper Hub
            </button>
          </nav>

          <button
            onClick={onRefresh}
            disabled={syncing}
            className="p-2.5 bg-gray-900 hover:bg-gray-800 text-gray-200 rounded-2xl border border-gray-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Refresh Prediction Tallies"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
}
