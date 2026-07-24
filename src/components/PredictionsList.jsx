import React from 'react';
import { ExternalLink, Quote, X, MessageSquare } from 'lucide-react';

export default function PredictionsList({ predictions, selectedGame, onClose }) {
  const filtered = selectedGame 
    ? predictions.filter(p => p.game_id === selectedGame.id)
    : predictions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-dark-800/90">
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">
              {selectedGame 
                ? `${selectedGame.away_team.name} @ ${selectedGame.home_team.name} Prediction Tally`
                : 'Scraped Predictions Inspector'}
            </h3>
            <p className="text-xs text-gray-400">
              Showing {filtered.length} extracted predictions with source links
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Predictions Scroll List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No predictions recorded for this game yet. Use the Scraper Hub to parse picks!
            </div>
          ) : (
            filtered.map((pred) => (
              <div key={pred.id} className="bg-dark-800/80 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{pred.predictor_name}</span>
                    <span className="text-xs text-gray-400">picked</span>
                    <div className="flex items-center gap-1.5 bg-dark-900 px-2.5 py-0.5 rounded-full border border-gray-700">
                      {pred.picked_team_logo && (
                        <img src={pred.picked_team_logo} alt="" className="w-4 h-4 object-contain" />
                      )}
                      <span className="text-xs font-bold text-amber-400">{pred.picked_team_name}</span>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400 bg-dark-900 px-2.5 py-0.5 rounded-full border border-gray-800 font-semibold">
                    {pred.platform || 'WEB'}
                  </span>
                </div>

                {/* Quote Snippet */}
                <div className="flex items-start gap-2 bg-dark-900/60 p-3 rounded-lg border border-gray-800/80 text-xs text-gray-300">
                  <Quote className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="italic">"{pred.quote_snippet}"</p>
                </div>

                {/* Source Footnote */}
                {pred.source_url && (
                  <div className="flex items-center justify-end text-[11px] text-gray-500 pt-1">
                    <a
                      href={pred.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      View Original Source <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-800 bg-dark-800/90 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
