import React, { useEffect, useState } from 'react';
import { Cpu, Scale, CheckCircle2, Loader2, Sparkles, Swords } from 'lucide-react';

export default function BattleRunner({ model1, model2, judgePersona }) {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setActiveStep(2), 600);
    const t2 = setTimeout(() => setActiveStep(3), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Dispatching Prompt to AI Models',
      desc: `Routing query concurrently to ${model1.name} & ${model2.name}`,
      icon: Cpu,
    },
    {
      id: 2,
      title: 'Generating Solutions in Parallel',
      desc: 'Formulating step-by-step solutions, formatting code, and applying safety guards',
      icon: Swords,
    },
    {
      id: 3,
      title: `${judgePersona.name} in Session`,
      desc: `Auditing accuracy, depth, edge-cases, and compliance scorecards`,
      icon: Scale,
    },
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-indigo-500/30 my-6 shadow-2xl relative overflow-hidden animate-pulse-glow">
      {/* Background glow banner */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Arena Battle in Progress
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                Live Compute
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparing {model1.name} vs {model2.name} under {judgePersona.name}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isDone = activeStep > step.id;
          const isCurrent = activeStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                  : isDone
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : 'bg-slate-900/20 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-indigo-500 text-white'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : isCurrent ? <Loader2 size={16} className="animate-spin" /> : step.id}
                  </div>
                  <span className="text-xs font-bold text-slate-200">{step.title}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
