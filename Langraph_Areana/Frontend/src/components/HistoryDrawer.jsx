import React, { useState } from 'react';
import { History, X, Trash2, Download, Play, Trophy, Search, Sparkles, Clock } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      {/* Backdrop overlay for closing */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full max-w-md h-full bg-slate-900/95 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden slide-in-from-right-full duration-500 ease-out">
        
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <History size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">Battle History</h3>
                <p className="text-[13px] text-slate-400 font-medium">{historyList.length} past evaluations saved</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems or models..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:bg-black/60 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Scrollable list of battles */}
        <div className="relative z-10 flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                <Clock size={28} className="text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-300">No battle history found</p>
              <p className="text-xs mt-2 text-slate-500 max-w-[200px]">Run a duel to automatically save your evaluation records here.</p>
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
                  className="group relative p-4 rounded-3xl bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-400 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                        {item.timestamp ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
                          <Trophy size={12} className="text-amber-400" /> {winnerName}
                        </span>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all scale-95 group-hover:scale-100"
                          title="Delete record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-[14px] font-medium text-slate-200 line-clamp-2 mb-4 leading-relaxed group-hover:text-white transition-colors">
                      {item.problem}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
                        <span className="truncate max-w-[120px]">{item.model_1?.name} <span className="text-slate-300 font-bold ml-1">{s1}</span></span>
                        <span className="text-slate-600 text-[10px]">VS</span>
                        <span className="truncate max-w-[120px]">{item.model_2?.name} <span className="text-slate-300 font-bold ml-1">{s2}</span></span>
                      </div>
                      <span className="text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-lg border border-indigo-400/20 flex items-center gap-1.5 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all text-[11px] font-bold tracking-wide shadow-sm">
                        <Play size={10} className="fill-current" /> LOAD
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="relative z-10 pt-5 mt-2 border-t border-white/10 flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            disabled={historyList.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 disabled:opacity-30 text-sm font-semibold text-slate-200 transition-all hover:shadow-lg disabled:hover:shadow-none hover:border-white/10 active:scale-[0.98]"
          >
            <Download size={16} />
            <span>Export Data</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={historyList.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-30 disabled:border-transparent text-sm font-semibold text-rose-400 transition-all hover:shadow-lg hover:shadow-rose-500/10 active:scale-[0.98]"
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
