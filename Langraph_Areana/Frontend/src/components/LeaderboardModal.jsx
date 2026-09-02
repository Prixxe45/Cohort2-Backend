import React from 'react';
import { Trophy, X, Medal, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { getStoredLeaderboard } from '../services/storage';

export default function LeaderboardModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const leaderboard = getStoredLeaderboard().sort((a, b) => b.elo - a.elo);

  const getTier = (elo) => {
    if (elo >= 1380) return { label: 'S+ Tier', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (elo >= 1350) return { label: 'S Tier', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    if (elo >= 1300) return { label: 'A Tier', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: 'B Tier', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0d121f] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                LLM Arena Global Leaderboard
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ELO Rating
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ranked by head-to-head AI judge win rates and evaluation scores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Model</th>
                <th className="pb-3">Tier</th>
                <th className="pb-3 text-center">Record (W/L/T)</th>
                <th className="pb-3 text-center">Avg Judge Score</th>
                <th className="pb-3 text-right pr-2">ELO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaderboard.map((item, index) => {
                const tier = getTier(item.elo);
                const totalBattles = item.wins + item.losses + item.ties;
                const winRate = totalBattles > 0 ? Math.round((item.wins / totalBattles) * 100) : 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-2 font-bold text-slate-300">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{winRate}% win rate ({totalBattles} duels)</div>
                    </td>
                    <td className="py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.color}`}>
                        {tier.label}
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-mono text-slate-300">
                      <span className="text-emerald-400 font-bold">{item.wins}W</span>{' '}
                      <span className="text-rose-400 font-bold">{item.losses}L</span>{' '}
                      <span className="text-slate-500">{item.ties}T</span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-amber-300 font-mono">
                      ⭐ {item.avgScore}/10
                    </td>
                    <td className="py-3.5 text-right pr-2 font-black text-indigo-400 text-sm font-mono">
                      {item.elo}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Ratings auto-adjust after every judge evaluated battle.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
