import React from 'react';
import { Calendar, Swords, Target, TestTube, Trophy, Compass } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, selectedLeague }) {
  const tabs = [
    { id: 'weektally', label: selectedLeague === 'EPL' ? 'Matchday' : 'Fixtures', icon: Calendar },
    { id: 'compare', label: 'Compare', icon: Swords },
    { id: 'mypicks', label: 'My Picks', icon: Target },
    { id: 'friends', label: 'Pools', icon: Compass },
    { id: 'backtest', label: 'Backtest', icon: TestTube },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-gray-700/80 px-2 py-2 safe-bottom-nav bg-dark-900/95 backdrop-blur-xl shadow-2xl">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-blue-600/30 to-indigo-600/40 text-white border border-blue-400/40 shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-amber-400 scale-110' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-extrabold tracking-tight ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
