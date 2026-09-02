import React from 'react';
import { Swords, Trophy, History, Settings, Sparkles, RefreshCw, Cpu } from 'lucide-react';

export default function Header({
  onOpenLeaderboard,
  onOpenHistory,
  onOpenSettings,
  onResetBattle,
  historyCount = 0,
  isBackendConnected = false,
  isBattleRunning = false,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090b10]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onResetBattle}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
              <Swords className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                OmniJudge <span className="text-indigo-400 font-black">ARENA</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                v2.0 LLM Battle
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multi-Model Confrontation & AI Supreme Judge Evaluation
            </p>
          </div>
        </div>

        {/* Center: Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`}></span>
          <span className="text-slate-300">
            {isBackendConnected ? 'LangGraph Engine Live' : 'AI Arena Simulation & Judge Active'}
          </span>
          <span className="text-slate-500 font-mono text-[10px]">| Real-time Scoring</span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetBattle}
            disabled={isBattleRunning}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition-all disabled:opacity-50"
            title="Start New Duel"
          >
            <RefreshCw size={13} className={isBattleRunning ? 'animate-spin' : ''} />
            <span>New Battle</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-all hover:scale-105"
            title="Model ELO Leaderboard"
          >
            <Trophy size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition-all"
            title="Battle History"
          >
            <History size={14} />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-500 text-white leading-none">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all"
            title="Arena Settings"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
