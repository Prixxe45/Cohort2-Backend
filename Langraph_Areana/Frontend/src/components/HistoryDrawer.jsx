import React, { useState } from 'react';
import { History, X, Trash2, Download, Play, Trophy, Search, Sparkles } from 'lucide-react';
import { getStoredHistory, deleteBattleHistoryItem, clearAllHistory } from '../services/storage';

export default function HistoryDrawer({ isOpen, onClose, onSelectBattle, currentHistory, setHistory }) {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const historyList = currentHistory || getStoredHistory();

  const filtered = historyList.filter((b) =>
    (b.problem || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.model_1?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.model_2?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = deleteBattleHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all battle history?')) {
      const updated = clearAllHistory();
      setHistory(updated);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(historyList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `omnijudge_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[#0d121f] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <History size={18} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Battle History</h3>
                <p className="text-xs text-slate-400">{historyList.length} past evaluations saved</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past problems or models..."
              className="w-full bg-[#080a0f] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Scrollable list of battles */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              <History size={32} className="mx-auto mb-2 opacity-40" />
              <p>No battle history found.</p>
              <p className="text-[11px] mt-1 text-slate-600">Run a duel to save records automatically.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const s1 = item.judge?.solution_1_score || 0;
              const s2 = item.judge?.solution_2_score || 0;
              const winnerName = s1 >= s2 ? item.model_1?.name : item.model_2?.name;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectBattle(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 font-mono">
                      {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recent'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <Trophy size={11} /> {winnerName}
                      </span>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 line-clamp-2 mb-2 leading-snug">
                    {item.problem}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="truncate">
                      {item.model_1?.name} ({s1}) vs {item.model_2?.name} ({s2})
                    </span>
                    <span className="text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-semibold">
                      <Play size={10} /> Load
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleExportJSON}
            disabled={historyList.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download size={13} />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={historyList.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 text-xs font-semibold text-rose-300 border border-rose-500/20 transition-colors"
          >
            <Trash2 size={13} />
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
