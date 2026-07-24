import React, { useState, useEffect } from 'react';
import { Calendar, Flame, MessageSquare, Quote, Filter, Search, Layers, Trophy, CheckCircle2, Zap, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { fetchSeasons, fetchGames, triggerSyncAllSources } from '../services/apiClient';

export default function WeekTallyView({ selectedLeague = 'NFL', onSelectGame }) {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(2026);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [expandedGameIds, setExpandedGameIds] = useState({});

  const toggleGameExpand = (gameId) => {
    setExpandedGameIds(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
  };

  useEffect(() => {
    async function loadInitialSeasons() {
      try {
        const res = await fetchSeasons(selectedLeague);
        setSeasons(res.seasons || []);
        if (res.seasons && res.seasons.length > 0) {
          const defaultSeason = res.seasons[0].season;
          setSelectedSeason(defaultSeason);
          if (res.seasons[0].weeks.length > 0) {
            setSelectedWeek(res.seasons[0].weeks[0]);
          }
        }
      } catch (err) {
        console.error('Error loading seasons:', err);
      }
    }
    loadInitialSeasons();
  }, [selectedLeague]);

  const loadWeekData = async () => {
    if (!selectedSeason || !selectedWeek) return;
    setLoading(true);
    try {
      const res = await fetchGames(selectedSeason, selectedWeek, selectedLeague);
      setGames(res.games || []);
    } catch (err) {
      console.error('Error loading week games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeekData();
  }, [selectedSeason, selectedWeek, selectedLeague]);

  const handleAutoSync = async () => {
    setSyncing(true);
    setSyncStatusMsg(`Auto-scraping ${selectedLeague === 'EPL' ? 'Opta, BBC, Sky Sports, Squawka & WhoScored' : 'Dimers, OddsShark, OddsTrader, Reddit & ESPN'}...`);
    try {
      const res = await triggerSyncAllSources(selectedLeague);
      setSyncStatusMsg(`Successfully updated! Scraped & parsed ${res.total_new_predictions || 0} latest ${selectedLeague} predictions.`);
      await loadWeekData();
    } catch (err) {
      setSyncStatusMsg(`Auto-sync error: ${err.message}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    }
  };

  const activeSeasonObj = seasons.find(s => s.season === selectedSeason);
  const availableWeeks = activeSeasonObj 
    ? activeSeasonObj.weeks 
    : (selectedLeague === 'EPL' 
        ? Array.from({ length: 38 }, (_, i) => i + 1)
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 22]
      );

  const getWeekLabel = (w) => {
    if (selectedLeague === 'EPL') return `Matchday ${w}`;
    if (w === 19) return 'Wildcard';
    if (w === 20) return 'Divisional';
    if (w === 21) return 'Conference';
    if (w === 22) return 'Super Bowl';
    return `Week ${w}`;
  };

  // Metrics
  let totalPicksInWeek = 0;
  const teamPickCounts = {};

  for (const g of games) {
    const preds = g.predictions || [];
    totalPicksInWeek += preds.length;
    for (const p of preds) {
      if (p.picked_team_name) {
        teamPickCounts[p.picked_team_name] = (teamPickCounts[p.picked_team_name] || 0) + 1;
      }
    }
  }

  let topTeamOfWeek = 'N/A';
  let topTeamCount = 0;
  for (const [team, cnt] of Object.entries(teamPickCounts)) {
    if (cnt > topTeamCount) {
      topTeamCount = cnt;
      topTeamOfWeek = team;
    }
  }

  // Filter games
  const filteredGames = games.filter(g => {
    const matchesSearch = !searchQuery || 
      g.home_team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.away_team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.home_team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.away_team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = platformFilter === 'ALL' || (g.predictions && g.predictions.some(p => p.platform === platformFilter));

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Control Header & Auto-Sync Action Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-700/80 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-gray-700/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase rounded-full tracking-wider">
                {selectedLeague === 'EPL' ? '⚽ Premier League Prediction Tally' : '🏈 NFL Football Prediction Tally'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit mt-2 tracking-tight">
              {selectedLeague === 'EPL' ? 'Premier League Matchday Prediction Tallies' : 'NFL Week-by-Week Prediction Tallies'}
            </h2>
            <p className="text-sm text-gray-300 font-medium mt-1">
              Select a {selectedLeague === 'EPL' ? 'matchday' : 'week'} below or click Auto-Sync to fetch predictions across all active sources
            </p>
          </div>

          {/* 1-Click Auto-Sync Action Button & Season Switcher */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleAutoSync}
              disabled={syncing}
              className={`w-full sm:w-auto px-6 py-3.5 ${
                selectedLeague === 'EPL'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400'
              } text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-95 border border-white/20`}
            >
              {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />}
              <span>Auto-Sync Latest Predictions</span>
            </button>

            <div className="flex bg-gray-900/90 p-1.5 rounded-2xl border border-gray-700 w-full sm:w-auto justify-center">
              <button
                onClick={() => { setSelectedSeason(2026); setSelectedWeek(1); }}
                className={`px-4 py-2 rounded-xl font-extrabold text-sm transition-all ${
                  selectedSeason === 2026 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-gray-300 hover:text-white'
                }`}
              >
                2026 Season
              </button>
              <button
                onClick={() => { setSelectedSeason(2025); setSelectedWeek(1); }}
                className={`px-4 py-2 rounded-xl font-extrabold text-sm transition-all ${
                  selectedSeason === 2025 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-gray-300 hover:text-white'
                }`}
              >
                2025 Archive
              </button>
            </div>
          </div>
        </div>

        {/* Sync Toast / Status Banner */}
        {syncStatusMsg && (
          <div className="bg-blue-950/80 border border-blue-500/40 p-4 rounded-2xl text-xs font-bold text-blue-200 flex items-center gap-3 animate-fade-in">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        {/* Clean Week / Matchday Tabs Navigation Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" /> {selectedLeague === 'EPL' ? 'Matchday Schedule Tabs:' : 'NFL Schedule Weeks Tabs:'}
            </span>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
              Showing {getWeekLabel(selectedWeek)} ({games.length} Fixtures)
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
            {availableWeeks.map(w => (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`px-4 py-2.5 rounded-xl font-black text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedWeek === w
                    ? selectedLeague === 'EPL'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/40 border border-emerald-300 scale-105'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 border border-blue-300 scale-105'
                    : 'bg-gray-900/90 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700/80'
                }`}
              >
                {getWeekLabel(w)}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Week Overview Stat Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="glass-card p-5 rounded-2xl border border-gray-700/80 flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 border border-blue-400/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-300 tracking-wider">Scheduled Matchups</p>
            <p className="text-2xl font-black text-white">{games.length} Fixtures</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-gray-700/80 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-400/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-300 tracking-wider">Total Scraped Tallies</p>
            <p className="text-2xl font-black text-amber-400">{totalPicksInWeek} Picks</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-gray-700/80 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-400/30">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-300 tracking-wider">Top Picked Club</p>
            <p className="text-2xl font-black text-white">{topTeamOfWeek}</p>
          </div>
        </div>

      </div>

      {/* Search & Platform Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/90 p-4 rounded-2xl border border-gray-700/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-300 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={selectedLeague === 'EPL' ? "Search clubs (Arsenal, Chelsea, Liverpool)..." : "Search teams (Chiefs, Eagles, Bills)..."}
            className="w-full bg-gray-800 border border-gray-600 focus:border-blue-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-gray-300" />
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
      </div>

      {/* Matchup Games Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-300">Loading {selectedSeason} {getWeekLabel(selectedWeek)} Fixtures...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-3xl border border-gray-700/80 space-y-4">
          <p className="text-gray-300 text-base font-bold">No predictions scraped for this {selectedLeague === 'EPL' ? 'matchday' : 'week'} yet.</p>
          <button
            onClick={handleAutoSync}
            disabled={syncing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> Scrape & Sync Predictions Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGames.map((game, idx) => {
            const preds = game.predictions || [];
            const awayPct = game.away_pick_percentage;
            const homePct = game.home_pick_percentage;

            return (
              <div 
                key={game.id} 
                className="glass-card rounded-3xl p-6 border border-gray-700/90 hover:border-blue-400/60 transition-all space-y-5 shadow-2xl"
              >
                {/* Game Header */}
                <div className="flex items-center justify-between border-b border-gray-700/80 pb-3">
                  <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                    {getWeekLabel(selectedWeek)} • Fixture #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-gray-300 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                    {game.status}
                  </span>
                </div>

                {/* Team Matchup */}
                <div className="grid grid-cols-5 items-center gap-3">
                  
                  {/* Away Team */}
                  <div className="col-span-2 flex flex-col items-center text-center">
                    <div className="w-18 h-18 rounded-full p-2.5 bg-gray-900 border border-gray-700 mb-2 shadow-inner">
                      <img src={game.away_team.logo_url} alt={game.away_team.name} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-base font-extrabold text-white line-clamp-1">{game.away_team.name}</h3>
                    <span className="text-sm font-black text-blue-400 mt-1">{awayPct}% Picked</span>
                    <span className="text-xs text-gray-300 font-bold font-mono">({game.away_pick_count} Votes)</span>
                  </div>

                  {/* VS Badge */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-gray-300 bg-gray-900 px-3.5 py-1.5 rounded-full border border-gray-700">
                      VS
                    </span>
                  </div>

                  {/* Home Team */}
                  <div className="col-span-2 flex flex-col items-center text-center">
                    <div className="w-18 h-18 rounded-full p-2.5 bg-gray-900 border border-gray-700 mb-2 shadow-inner">
                      <img src={game.home_team.logo_url} alt={game.home_team.name} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-base font-extrabold text-white line-clamp-1">{game.home_team.name}</h3>
                    <span className="text-sm font-black text-amber-400 mt-1">{homePct}% Picked</span>
                    <span className="text-xs text-gray-300 font-bold font-mono">({game.home_pick_count} Votes)</span>
                  </div>

                </div>

                {/* Consensus Split Bar */}
                <div className="bg-gray-900 p-3.5 rounded-2xl border border-gray-700">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-gray-200 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" /> Matchup Consensus Split
                    </span>
                    <span className="text-gray-300 font-mono flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-blue-400" /> {preds.length} Total Predictions
                    </span>
                  </div>

                  <div className="h-3.5 w-full bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
                    <div style={{ width: `${awayPct}%` }} className="h-full bg-blue-500 transition-all duration-500" />
                    <div style={{ width: `${homePct}%` }} className="h-full bg-amber-500 transition-all duration-500" />
                  </div>
                </div>

                {/* Collapsible Scraped Prediction Quotes Dropdown Menu */}
                <div className="pt-2 border-t border-gray-700/80">
                  <button
                    onClick={() => toggleGameExpand(game.id)}
                    className="w-full flex items-center justify-between p-3.5 bg-gray-900/90 hover:bg-gray-800 rounded-2xl border border-gray-700/90 transition-all cursor-pointer group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-gray-200 group-hover:text-white">
                        Scraped Predictions ({preds.length})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-400 bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-700">
                        {expandedGameIds[game.id] ? 'Hide' : 'View'} Quotes
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedGameIds[game.id] ? 'rotate-180 text-blue-400' : ''}`} />
                    </div>
                  </button>

                  {/* Dropdown Menu Content */}
                  {expandedGameIds[game.id] && (
                    <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin animate-fade-in">
                      {preds.length === 0 ? (
                        <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 text-center space-y-2">
                          <p className="text-xs text-gray-400 italic">No predictions scraped for this fixture yet.</p>
                          <button
                            onClick={handleAutoSync}
                            disabled={syncing}
                            className="text-xs text-blue-400 hover:text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-400" /> Click to Auto-Scrape Sources
                          </button>
                        </div>
                      ) : (
                        preds.map(p => (
                          <div key={p.id} className="bg-gray-900/90 p-3.5 rounded-2xl border border-gray-700/80 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-white text-sm">{p.predictor_name}</span>
                              <span className="text-xs text-gray-200 bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-600 font-bold">{p.platform}</span>
                            </div>
                            <p className="text-gray-200 font-bold text-xs">
                              Picked: <span className="text-amber-400 font-black">{p.picked_team_name}</span>
                            </p>
                            <div className="flex items-start gap-2 text-xs text-gray-200 bg-black/40 p-2.5 rounded-xl italic leading-relaxed border border-gray-800">
                              <Quote className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                              <span>"{p.quote_snippet}"</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
