import React from 'react';
import { Trophy, Layers, RefreshCw, Zap, Calendar, Globe } from 'lucide-react';

export default function Header({ selectedLeague, setSelectedLeague, totalPredictions, totalSources, activeTab, setActiveTab, onRefresh, syncing }) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-gray-700/80 px-4 sm:px-6 py-3 safe-top">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Top Header Row (Mobile & Desktop) */}
        <div className="w-full md:w-auto flex items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black tracking-tight text-white font-outfit leading-tight">
                Gridiron & Pitch Oracle
              </h1>
              <p className="text-[11px] text-blue-400 font-bold hidden sm:block">AI Sports Prediction Tally</p>
            </div>
          </div>

          {/* League Switcher Pills */}
          <div className="flex bg-gray-900/90 p-1 rounded-2xl border border-gray-700/90 shrink-0">
            <button
              onClick={() => setSelectedLeague('ALL')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                selectedLeague === 'ALL'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3 text-amber-300" /> <span className="hidden xs:inline">All</span>
            </button>
            <button
              onClick={() => setSelectedLeague('NFL')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                selectedLeague === 'NFL'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🏈 NFL
            </button>
            <button
              onClick={() => setSelectedLeague('EPL')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                selectedLeague === 'EPL'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚽ EPL
            </button>
          </div>

          {/* Refresh Button on Mobile */}
          <button
            onClick={onRefresh}
            disabled={syncing}
            className="md:hidden p-2 bg-gray-900 hover:bg-gray-800 text-gray-200 rounded-xl border border-gray-700 shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
            title="Refresh Prediction Tallies"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>

        {/* Desktop Navigation Tabs & Refresh Button */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Stats Badges */}
          <div className="flex items-center gap-4 bg-gray-900/90 px-4 py-1.5 rounded-2xl border border-gray-700/80 text-xs">
            <div className="flex items-center gap-2 border-r border-gray-700 pr-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-white">{totalPredictions} Picks</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="font-extrabold text-blue-400">{totalSources} Outlets</span>
            </div>
          </div>

          <nav className="flex bg-gray-900/90 p-1.5 rounded-2xl border border-gray-700/80">
            <button
              onClick={() => setActiveTab('weektally')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'weektally' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Matchups
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'compare' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              ⚔️ Compare
            </button>
            <button
              onClick={() => setActiveTab('mypicks')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'mypicks' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              🎯 My Picks
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'friends' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              👥 Friends Pool
            </button>
            <button
              onClick={() => setActiveTab('backtest')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'backtest' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              🧪 Backtest
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'leaderboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('scraper')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'scraper' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              Scraper Hub
            </button>
          </nav>

          <button
            onClick={onRefresh}
            disabled={syncing}
            className="p-2.5 bg-gray-900 hover:bg-gray-800 text-gray-200 rounded-2xl border border-gray-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Refresh Prediction Tallies"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
}
