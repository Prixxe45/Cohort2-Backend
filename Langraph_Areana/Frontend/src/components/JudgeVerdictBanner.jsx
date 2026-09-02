import React, { useEffect } from 'react';
import { Trophy, Award, CheckCircle, Scale, ArrowRight, Star, AlertTriangle, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JudgeVerdictBanner({ battleResult, judgePersona }) {
  if (!battleResult || !battleResult.judge) return null;

  const { judge, model_1, model_2 } = battleResult;
  const s1_score = Number(judge.solution_1_score || 0);
  const s2_score = Number(judge.solution_2_score || 0);

  const isS1Winner = s1_score >= s2_score;
  const winnerModel = isS1Winner ? model_1 : model_2;
  const runnerUpModel = isS1Winner ? model_2 : model_1;
  const winnerScore = Math.max(s1_score, s2_score);
  const runnerUpScore = Math.min(s1_score, s2_score);
  const scoreDiff = (winnerScore - runnerUpScore).toFixed(1);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'],
      });
    } catch {
      // ignore
    }
  }, [battleResult]);

  return (
    <div className="w-full glass-panel-judge rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl relative overflow-hidden my-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header: Supreme Verdict Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-600 p-0.5 shadow-xl shadow-purple-500/30">
            <div className="w-full h-full bg-[#111625] rounded-[14px] flex items-center justify-center">
              <Scale className="w-6 h-6 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                Supreme AI Judge Verdict
              </span>
              <span className="text-xs text-slate-400">
                Audited by {judgePersona.name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight flex items-center gap-2">
              <span>Winner Declared:</span>
              <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                {winnerModel.name}
              </span>
            </h2>
          </div>
        </div>

        {/* Victory Score Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-purple-500/30 px-4 py-2.5 rounded-2xl shadow-inner">
          <div className="text-right">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Winning Margin
            </div>
            <div className="text-xl font-extrabold text-white">
              +{scoreDiff} <span className="text-xs text-slate-400 font-normal">pts advantage</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Trophy size={20} />
          </div>
        </div>
      </div>

      {/* Dual Model Score Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Solution 1 Score Card */}
        <div
          className={`rounded-2xl p-5 border transition-all ${
            isS1Winner
              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/50 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{model_1.avatar || '🟠'}</span>
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span>Solution 1: {model_1.name}</span>
                  {isS1Winner && (
                    <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Trophy size={11} /> WINNER
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">{model_1.provider}</div>
              </div>
            </div>

            {/* Circular Score display */}
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-black ${isS1Winner ? 'text-emerald-400 glow-text-emerald' : 'text-slate-300'}`}>
                {s1_score}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/10</span>
            </div>
          </div>

          {/* Progress Score Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isS1Winner ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-600'
              }`}
              style={{ width: `${Math.min(100, s1_score * 10)}%` }}
            ></div>
          </div>

          {/* Solution 1 Judge Reasoning Snippet */}
          <div className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="font-semibold text-indigo-300 block mb-1">Judge Rationale:</span>
            {judge.solution_1_reasoning}
          </div>
        </div>

        {/* Solution 2 Score Card */}
        <div
          className={`rounded-2xl p-5 border transition-all ${
            !isS1Winner
              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/50 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{model_2.avatar || '🛡️'}</span>
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span>Solution 2: {model_2.name}</span>
                  {!isS1Winner && (
                    <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Trophy size={11} /> WINNER
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">{model_2.provider}</div>
              </div>
            </div>

            {/* Circular Score display */}
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-black ${!isS1Winner ? 'text-emerald-400 glow-text-emerald' : 'text-slate-400'}`}>
                {s2_score}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/10</span>
            </div>
          </div>

          {/* Progress Score Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                !isS1Winner ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-600'
              }`}
              style={{ width: `${Math.min(100, s2_score * 10)}%` }}
            ></div>
          </div>

          {/* Solution 2 Judge Reasoning Snippet */}
          <div className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="font-semibold text-teal-300 block mb-1">Judge Rationale:</span>
            {judge.solution_2_reasoning}
          </div>
        </div>
      </div>

      {/* Judge Detailed Recommendation & Explanation Section */}
      <div className="space-y-4">
        {/* Recommendation Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-start gap-3 shadow-lg">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 mt-0.5 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1 flex items-center gap-1.5">
              <span>Judge's Strategic Recommendation</span>
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {judge.recommendation || `Adopt the solution formulated by ${winnerModel.name}. It excels in depth, practical utility, and clear communication.`}
            </p>
          </div>
        </div>

        {/* Explanation Box */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 mt-0.5 shrink-0">
            <Scale size={20} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
              Comparative Explanation & Synthesis
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {judge.explanation || `${winnerModel.name} earned higher marks by addressing the prompt directly with substantive, well-structured information while maintaining appropriate boundaries.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
