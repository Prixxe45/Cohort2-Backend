import React, { useState } from 'react';
import { Send, Sparkles, Scale, Zap, Shield, HelpCircle, Layers, ChevronDown } from 'lucide-react';
import { AVAILABLE_MODELS, JUDGE_PERSONAS } from '../data/models';
import { PRESET_BENCHMARKS } from '../data/presets';

export default function PromptInput({
  problem,
  setProblem,
  model1,
  setModel1,
  model2,
  setModel2,
  judgePersona,
  setJudgePersona,
  onStartBattle,
  isBattleRunning,
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(null);

  const handlePresetSelect = (preset) => {
    setSelectedPresetId(preset.id);
    setProblem(preset.problem);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (problem.trim() && !isBattleRunning) {
        onStartBattle();
      }
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Preset Problem Pills */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>Benchmark Problem Presets:</span>
          </label>
          <span className="text-[11px] text-slate-500">Pick a preset or write your own problem below</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_BENCHMARKS.map((preset) => {
            const isSelected = selectedPresetId === preset.id || problem === preset.problem;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 border border-indigo-400/40 scale-102'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{preset.icon}</span>
                <span className="font-semibold">{preset.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 text-slate-300 font-mono">
                  {preset.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Textarea Input */}
      <div className="relative mb-5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <HelpCircle size={13} className="text-indigo-400" />
            Your Problem / Query Prompt:
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            Ctrl + Enter to trigger battle
          </span>
        </label>
        <textarea
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
            setSelectedPresetId(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter any challenging question, code bug, ethical scenario, or problem (e.g. 'how to do sex' or 'implement an LRU cache')..."
          rows={3}
          className="w-full bg-[#0c101a] border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 resize-y transition-all outline-none"
        />
      </div>

      {/* Model & Judge Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {/* Model 1 Picker */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Model Alpha:
            </span>
            <span className="text-[10px] text-slate-500">Solution 1</span>
          </div>
          <select
            value={model1.id}
            onChange={(e) => {
              const m = AVAILABLE_MODELS.find((x) => x.id === e.target.value);
              if (m) setModel1(m);
            }}
            className="w-full bg-[#0c101a] border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500 transition-colors"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={`m1_${m.id}`} value={m.id}>
                {m.avatar} {m.name} ({m.provider})
              </option>
            ))}
          </select>
          <div className="mt-1.5 text-[11px] text-slate-400 truncate">
            {model1.tagline}
          </div>
        </div>

        {/* Model 2 Picker */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span> Model Beta:
            </span>
            <span className="text-[10px] text-slate-500">Solution 2</span>
          </div>
          <select
            value={model2.id}
            onChange={(e) => {
              const m = AVAILABLE_MODELS.find((x) => x.id === e.target.value);
              if (m) setModel2(m);
            }}
            className="w-full bg-[#0c101a] border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-teal-500 transition-colors"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={`m2_${m.id}`} value={m.id}>
                {m.avatar} {m.name} ({m.provider})
              </option>
            ))}
          </select>
          <div className="mt-1.5 text-[11px] text-slate-400 truncate">
            {model2.tagline}
          </div>
        </div>

        {/* Judge Persona Picker */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Scale size={12} /> AI Supreme Judge:
            </span>
            <span className="text-[10px] text-purple-400/80">Arbitration</span>
          </div>
          <select
            value={judgePersona.id}
            onChange={(e) => {
              const j = JUDGE_PERSONAS.find((x) => x.id === e.target.value);
              if (j) setJudgePersona(j);
            }}
            className="w-full bg-[#0c101a] border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-purple-500 transition-colors"
          >
            {JUDGE_PERSONAS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.icon} {j.name}
              </option>
            ))}
          </select>
          <div className="mt-1.5 text-[11px] text-purple-300/80 truncate">
            Focus: {judgePersona.focus}
          </div>
        </div>
      </div>

      {/* Battle Trigger Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[11px]">
            ⚡ Parallel Execution
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[11px]">
            ⚖️ Automated Verdict
          </span>
        </div>

        <button
          onClick={onStartBattle}
          disabled={!problem.trim() || isBattleRunning}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-xl ${
            !problem.trim() || isBattleRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isBattleRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Executing Arena Battle & Supreme Judge...</span>
            </>
          ) : (
            <>
              <Zap size={16} className="text-amber-300" />
              <span>Launch AI Duel & Supreme Evaluation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
