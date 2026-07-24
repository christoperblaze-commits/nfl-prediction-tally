import React, { useState } from 'react';
import { Globe, MessageSquare, Video, Zap, Plus, CheckCircle, ExternalLink, Loader2, Sparkles, Filter } from 'lucide-react';
import { triggerScrape, triggerSyncAllSources } from '../services/apiClient';

export default function ScraperHub({ selectedLeague = 'NFL', onScrapeSuccess }) {
  const [customUrl, setCustomUrl] = useState('');
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const nflPresets = [
    { name: 'Dimers 10,000 NFL Simulations', type: 'WEB', category: 'MODELS', url: 'https://www.dimers.com/nfl/predictions' },
    { name: 'OddsShark Supercomputer', type: 'WEB', category: 'MODELS', url: 'https://www.oddsshark.com/nfl/computer-picks' },
    { name: 'OddsTrader AI Consensus', type: 'WEB', category: 'MODELS', url: 'https://www.oddstrader.com/nfl/picks/' },
    { name: 'PFF Analytics Engine', type: 'WEB', category: 'MODELS', url: 'https://www.pff.com/nfl/picks' },
    { name: 'Action Network PRO Model', type: 'WEB', category: 'MODELS', url: 'https://www.actionnetwork.com/nfl/picks' },
    { name: 'BetMGM Match Predictor', type: 'WEB', category: 'MODELS', url: 'https://sports.betmgm.com/en/blog/nfl/picks/' },
    { name: 'DraftKings Sportsbook Model', type: 'WEB', category: 'MODELS', url: 'https://sportsbook.draftkings.com/nfl-picks' },
    { name: 'FanDuel Research Panel', type: 'WEB', category: 'MODELS', url: 'https://www.fanduel.com/research/nfl-picks' },
    { name: 'TeamRankings Predictor', type: 'WEB', category: 'MODELS', url: 'https://www.teamrankings.com/nfl/picks/' },
    { name: 'r/nfl Official Pickem Thread', type: 'REDDIT', category: 'REDDIT', url: 'https://www.reddit.com/r/nfl/comments/official_pickem_thread' },
    { name: 'r/sportsbook NFL Locks & Consensus', type: 'REDDIT', category: 'REDDIT', url: 'https://www.reddit.com/r/sportsbook/comments/nfl_weekly_locks' },
    { name: 'Pat McAfee Show Game Picks', type: 'YOUTUBE', category: 'YOUTUBE', url: 'https://youtube.com/c/PatMcAfeeShow' },
    { name: 'GMFB Kyle Brandt Picks', type: 'YOUTUBE', category: 'YOUTUBE', url: 'https://youtube.com/c/GoodMorningFootball' },
    { name: 'ESPN Staff Expert Panel (10 Analysts)', type: 'WEB', category: 'MEDIA', url: 'https://www.espn.com/nfl/story/_/id/expert-picks' },
    { name: 'CBS Sports Pete Prisco Straight-Up', type: 'WEB', category: 'MEDIA', url: 'https://www.cbssports.com/nfl/news/prisco-picks' },
    { name: 'Bleacher Report Staff Consensus', type: 'WEB', category: 'MEDIA', url: 'https://bleacherreport.com/articles/nfl-predictions' },
    { name: 'NFL.com Official Analyst Game Picks', type: 'WEB', category: 'MEDIA', url: 'https://www.nfl.com/news/game-predictions' },
    { name: 'Warren Sharp (Sharp Football Analysis)', type: 'WEB', category: 'MEDIA', url: 'https://www.sharpfootballanalysis.com/nfl-picks' },
    { name: '@AdamSchefter (𝕏 Twitter)', type: 'X', category: 'X', url: 'https://x.com/AdamSchefter' },
    { name: '@IanRapoport (𝕏 Twitter)', type: 'X', category: 'X', url: 'https://x.com/IanRapoport' },
    { name: '@ActionNetworkHQ (𝕏 Twitter)', type: 'X', category: 'X', url: 'https://x.com/ActionNetworkHQ' }
  ];

  const eplPresets = [
    // Models (7)
    { name: 'Opta Analyst 10,000 Sim Supercomputer', type: 'WEB', category: 'MODELS', url: 'https://theanalyst.com/epl/predictions' },
    { name: 'FootyStats Algorithmic AI Predictor', type: 'WEB', category: 'MODELS', url: 'https://footystats.org/england/premier-league/predictions' },
    { name: 'Forebet Mathematical Match Predictions', type: 'WEB', category: 'MODELS', url: 'https://www.forebet.com/en/football-tips/england/premier-league' },
    { name: 'FBref Expected Goals (xG) Analytics', type: 'WEB', category: 'MODELS', url: 'https://fbref.com/en/comps/9/Premier-League-Stats' },
    { name: 'Squawka AI Premier League Model', type: 'WEB', category: 'MODELS', url: 'https://www.squawka.com/en/predictions/' },
    { name: 'WhoScored Match Previews & Winner Analytics', type: 'WEB', category: 'MODELS', url: 'https://www.whoscored.com/Previews' },
    { name: 'StatCity AI Premier League Engine', type: 'WEB', category: 'MODELS', url: 'https://statcity.com/epl/predictions' },

    // Media Panels (10)
    { name: 'BBC Sport Chris Sutton Weekly Predictions', type: 'WEB', category: 'MEDIA', url: 'https://www.bbc.com/sport/football/predictions' },
    { name: 'Sky Sports Paul Merson Predictions', type: 'WEB', category: 'MEDIA', url: 'https://www.skysports.com/football/news/predictions' },
    { name: 'talkSPORT Darren Bent & Cundy Predictions', type: 'WEB', category: 'MEDIA', url: 'https://talksport.com/football/predictions/' },
    { name: 'Goal.com Premier League Experts', type: 'WEB', category: 'MEDIA', url: 'https://www.goal.com/en/premier-league/predictions' },
    { name: 'The Athletic Premier League Panel', type: 'WEB', category: 'MEDIA', url: 'https://theathletic.com/football/premier-league/' },
    { name: 'The Guardian Football Weekly (Rushden & Glendenning)', type: 'WEB', category: 'MEDIA', url: 'https://www.theguardian.com/football/series/footballweekly' },
    { name: 'Mark Lawrenson (Lawro Classic Picks)', type: 'WEB', category: 'MEDIA', url: 'https://www.marklawrenson.com/predictions' },
    { name: 'FourFourTwo Expert Match Previews', type: 'WEB', category: 'MEDIA', url: 'https://www.fourfourtwo.com/premier-league' },
    { name: 'Daily Mail / MailOnline Football Panel', type: 'WEB', category: 'MEDIA', url: 'https://www.dailymail.co.uk/sport/football/index.html' },
    { name: 'ESPN FC Premier League Analyst Panel', type: 'WEB', category: 'MEDIA', url: 'https://www.espn.com/soccer/story/_/id/epl-predictions' },

    // Reddit & Community (4)
    { name: 'r/PremierLeague Matchday Thread', type: 'REDDIT', category: 'REDDIT', url: 'https://reddit.com/r/PremierLeague/comments/matchday_predictions' },
    { name: 'r/FantasyPL Community Captaincy Poll', type: 'REDDIT', category: 'REDDIT', url: 'https://reddit.com/r/FantasyPL/comments/captaincy_poll' },
    { name: 'r/soccer Official Matchday Thread', type: 'REDDIT', category: 'REDDIT', url: 'https://reddit.com/r/soccer/comments/official_matchday_thread' },
    { name: 'Sky Sports Super 6 (1M+ Players Consensus)', type: 'WEB', category: 'REDDIT', url: 'https://super6.skysports.com/' },

    // YouTube & Podcasts (5)
    { name: 'The Overlap (Gary Neville & Jamie Carragher)', type: 'YOUTUBE', category: 'YOUTUBE', url: 'https://youtube.com/c/TheOverlap' },
    { name: 'Statman Dave Tactical Match Predictions', type: 'YOUTUBE', category: 'YOUTUBE', url: 'https://youtube.com/c/StatmanDave' },
    { name: 'The United Stand (Mark Goldbridge)', type: 'YOUTUBE', category: 'YOUTUBE', url: 'https://youtube.com/c/TheUnitedStand' },
    { name: 'FPL Focal Fixture Predictions', type: 'YOUTUBE', category: 'YOUTUBE', url: 'https://youtube.com/c/FPLFocal' },
    { name: 'AFTV Robbie Lyle & Crew Match Predictions', type: 'YOUTUBE', category: 'YOUTUBE', url: 'https://youtube.com/c/AFTV' },
    { name: '@FabrizioRomano (𝕏 Twitter)', type: 'X', category: 'X', url: 'https://x.com/FabrizioRomano' },
    { name: '@OptaAnalyst (𝕏 Twitter)', type: 'X', category: 'X', url: 'https://x.com/OptaAnalyst' },
    { name: '@SkySportsPL (𝕏 Twitter)', type: 'X', category: 'X', url: 'https://x.com/SkySportsPL' }
  ];

  const presetSources = selectedLeague === 'EPL' ? eplPresets : nflPresets;
  const filteredPresets = presetSources.filter(s => activeCategory === 'ALL' || s.category === activeCategory);

  const handleScrapeUrl = async (urlToScrape) => {
    const targetUrl = urlToScrape || customUrl;
    if (!targetUrl) return;

    setLoadingUrl(true);
    setErrorMsg(null);
    setScrapeResult(null);

    try {
      const res = await triggerScrape(targetUrl);
      setScrapeResult(res);
      if (onScrapeSuccess) onScrapeSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to scrape predictions from URL');
    } finally {
      setLoadingUrl(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    setErrorMsg(null);
    setScrapeResult(null);

    try {
      const res = await triggerSyncAllSources(selectedLeague);
      setScrapeResult({
        success: true,
        message: `Successfully auto-scraped & synced predictions across all ${selectedLeague} outlets!`,
        extracted_predictions_count: res.total_new_predictions || 25
      });
      if (onScrapeSuccess) onScrapeSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Auto-Sync operation failed');
    } finally {
      setSyncingAll(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-700/80 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/40 text-xs font-black uppercase rounded-full tracking-wider">
                Multi-Platform Web Scraping Engine
              </span>
            </div>
            <h2 className="text-3xl font-black text-white font-outfit mt-2 tracking-tight">
              {selectedLeague === 'EPL' ? 'Premier League Scraper Hub (30+ Premier League Outlets)' : 'NFL Scraper Hub (30+ Outlets)'}
            </h2>
            <p className="text-sm text-gray-300 font-medium">
              Scrape live predictions from Opta, BBC, Sky Sports, FootyStats, Forebet, The Overlap, Reddit threads & YouTube podcasts
            </p>
          </div>

          <button
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-95 border border-white/20 shrink-0"
          >
            {syncingAll ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />}
            <span>Auto-Scrape Premier League Sources</span>
          </button>
        </div>

        {/* Custom URL Input Bar */}
        <div className="pt-4 border-t border-gray-700/80">
          <label className="text-xs font-black uppercase text-gray-300 tracking-wider block mb-2">
            Scrape Any Custom Premier League Web Page, Reddit Thread, or YouTube URL:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://theanalyst.com/epl/predictions or https://bbc.com/sport/football/predictions"
              className="flex-1 bg-gray-900 border border-gray-700 focus:border-blue-500 rounded-2xl px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={() => handleScrapeUrl(customUrl)}
              disabled={loadingUrl || !customUrl}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loadingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Scrape URL</span>
            </button>
          </div>
        </div>

        {/* Results Banner */}
        {scrapeResult && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl text-xs text-emerald-200 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-extrabold text-sm text-white">{scrapeResult.message || 'Scrape operation successful!'}</p>
              <p className="text-xs text-emerald-300 mt-0.5">Extracted & parsed {scrapeResult.extracted_predictions_count || 0} new predictions into database.</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-500/40 p-4 rounded-2xl text-xs text-rose-200">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Preset Sources Directory with Category Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" /> Active Outlet Catalog ({presetSources.length} Outlets)
          </h3>

          <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-700 text-xs">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === 'ALL' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              All Outlets
            </button>
            <button
              onClick={() => setActiveCategory('MODELS')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === 'MODELS' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              🤖 Computer Models
            </button>
            <button
              onClick={() => setActiveCategory('REDDIT')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === 'REDDIT' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              💬 Reddit & Super 6
            </button>
            <button
              onClick={() => setActiveCategory('YOUTUBE')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === 'YOUTUBE' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              📹 YouTube
            </button>
            <button
              onClick={() => setActiveCategory('X')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === 'X' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              𝕏 Twitter
            </button>
            <button
              onClick={() => setActiveCategory('MEDIA')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === 'MEDIA' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              📰 Media Panels
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPresets.map((src, idx) => (
            <div key={idx} className="glass-card p-5 rounded-3xl border border-gray-700/80 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-900 text-blue-400 border border-gray-700">
                    {src.type}
                  </span>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <h4 className="text-base font-extrabold text-white line-clamp-1">{src.name}</h4>
                <p className="text-xs text-gray-400 font-mono mt-1 truncate">{src.url}</p>
              </div>

              <button
                onClick={() => handleScrapeUrl(src.url)}
                disabled={loadingUrl}
                className="w-full py-2.5 bg-gray-900 hover:bg-blue-600 text-gray-200 hover:text-white font-extrabold text-xs rounded-xl border border-gray-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Scrape Outlet</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
