import React, { useState } from 'react';
import { Trophy, Copy, Check, Shield, FileText, CheckCircle, AlertCircle, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function SolutionsView({ battleResult }) {
  if (!battleResult) return null;

  const { solution_1, solution_2, model_1, model_2, judge } = battleResult;
  const s1_score = Number(judge?.solution_1_score || 0);
  const s2_score = Number(judge?.solution_2_score || 0);

  const isS1Winner = s1_score >= s2_score;

  return (
    <div className="w-full my-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-sm inline-block"></span>
            Side-by-Side Model Solutions
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare complete formatted answers, reasoning depth, and judge critiques
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold flex items-center gap-1">
            <Trophy size={13} /> {isS1Winner ? model_1.name : model_2.name} Lead
          </span>
        </div>
      </div>

      {/* Grid of Solutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solution 1 Card */}
        <SolutionCard
          solutionNumber={1}
          model={model_1}
          content={solution_1}
          score={s1_score}
          isWinner={isS1Winner}
          reasoning={judge?.solution_1_reasoning}
          accentColor="indigo"
        />

        {/* Solution 2 Card */}
        <SolutionCard
          solutionNumber={2}
          model={model_2}
          content={solution_2}
          score={s2_score}
          isWinner={!isS1Winner}
          reasoning={judge?.solution_2_reasoning}
          accentColor="teal"
        />
      </div>
    </div>
  );
}

function SolutionCard({ solutionNumber, model, content, score, isWinner, reasoning, accentColor }) {
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  const charCount = content ? content.length : 0;

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
        isWinner
          ? 'glass-panel-winner border-emerald-500/40'
          : 'glass-panel border-slate-800/90'
      }`}
    >
      {/* Top Header of the Solution Card */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center justify-between">
          {/* Model info */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">{model.avatar || '🤖'}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Solution {solutionNumber}
                </span>
                <span className="text-xs px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                  {model.provider}
                </span>
              </div>
              <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                {model.name}
              </h4>
            </div>
          </div>

          {/* Score & Winner Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-sm ${
                isWinner
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black text-sm'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 font-bold text-sm'
              }`}
            >
              {isWinner && <Trophy size={14} className="text-amber-400 animate-bounce" />}
              <span>{score}/10</span>
              {isWinner && <span className="text-[10px] uppercase tracking-wider ml-1">WINNER</span>}
            </div>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy solution text"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Word count & latency sub-bar */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
          <span className="font-mono text-slate-500">Output Stream: Complete</span>
        </div>
      </div>

      {/* Main Solution Content Body */}
      <div className="p-5 sm:p-6 flex-1 overflow-y-auto max-h-[600px] leading-relaxed bg-[#0b0f19]/60">
        <MarkdownRenderer content={content} />
      </div>

      {/* Footer: Judge Reasoning Collapsible Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/70 p-4">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setShowReasoning(!showReasoning)}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Supreme Judge Assessment for Solution {solutionNumber}</span>
          </div>
          <button className="text-slate-400 group-hover:text-white transition-colors">
            {showReasoning ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showReasoning && reasoning && (
          <div className="mt-2.5 text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 animate-fadeIn">
            {reasoning}
          </div>
        )}
      </div>
    </div>
  );
}
