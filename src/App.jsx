import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import WeekTallyView from './components/WeekTallyView';
import BacktestView from './components/BacktestView';
import ModelCompare from './components/ModelCompare';
import MyPicksView from './components/MyPicksView';
import Leaderboard from './components/Leaderboard';
import ScraperHub from './components/ScraperHub';
import PredictionsList from './components/PredictionsList';
import { fetchLeaderboard, fetchPredictions, triggerEspnSync } from './services/apiClient';

export default function App() {
  const [selectedLeague, setSelectedLeague] = useState('NFL');
  const [activeTab, setActiveTab] = useState('weektally');
  const [leaderboard, setLeaderboard] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadData = async () => {
    try {
      const [leaderboardRes, predictionsRes] = await Promise.all([
        fetchLeaderboard(selectedLeague),
        fetchPredictions(null, null, selectedLeague)
      ]);
      setLeaderboard(leaderboardRes.leaderboard || []);
      setPredictions(predictionsRes.predictions || []);
    } catch (err) {
      console.error('Error loading app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLeague]);

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      await triggerEspnSync();
      await loadData();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const totalPredictions = predictions.length;
  const uniqueSources = new Set(predictions.map(p => p.source_id)).size || 4;

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Header Bar with League Switcher */}
      <Header 
        selectedLeague={selectedLeague}
        setSelectedLeague={setSelectedLeague}
        totalPredictions={totalPredictions}
        totalSources={uniqueSources}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={handleRefresh}
        syncing={syncing}
      />

      {/* Main Content Area (pb-24 on mobile so bottom bar never obscures content) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-24 md:pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-gray-400">Loading Gridiron & Pitch Oracle Data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'weektally' && (
              <WeekTallyView 
                selectedLeague={selectedLeague}
                onSelectGame={(g) => setSelectedGame(g)} 
              />
            )}

            {activeTab === 'compare' && (
              <ModelCompare
                selectedLeague={selectedLeague}
                leaderboard={leaderboard}
              />
            )}

            {activeTab === 'mypicks' && (
              <MyPicksView
                selectedLeague={selectedLeague}
              />
            )}

            {activeTab === 'backtest' && (
              <BacktestView
                selectedLeague={selectedLeague}
              />
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard 
                selectedLeague={selectedLeague}
                leaderboard={leaderboard} 
                predictions={predictions} 
              />
            )}

            {activeTab === 'scraper' && (
              <ScraperHub 
                selectedLeague={selectedLeague}
                onScrapeSuccess={loadData} 
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLeague={selectedLeague}
      />

      {/* Inspection Modal */}
      {selectedGame && (
        <PredictionsList
          selectedGame={selectedGame}
          predictions={predictions}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {/* Desktop Footer */}
      <footer className="hidden md:block border-t border-gray-800 bg-dark-900 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Gridiron & Pitch Oracle &copy; 2026 • AI-Powered NFL & Premier League Prediction Aggregator</span>
          <span>Switch Between NFL & English Premier League (EPL)</span>
        </div>
      </footer>

    </div>
  );
}
