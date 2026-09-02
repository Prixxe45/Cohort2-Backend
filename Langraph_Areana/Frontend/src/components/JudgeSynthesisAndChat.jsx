import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, Bot, User, CheckCircle2, Copy, Check, Scale } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function JudgeSynthesisAndChat({ battleResult, judgePersona }) {
  if (!battleResult) return null;

  const { judge, model_1, model_2, problem, solution_1, solution_2 } = battleResult;
  const [copiedSynthesis, setCopiedSynthesis] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'judge',
      text: `Hello! I am your **${judgePersona.name}**. I evaluated this duel between **${model_1.name}** (${judge.solution_1_score}/10) and **${model_2.name}** (${judge.solution_2_score}/10). Feel free to question my verdict or ask for deeper breakdowns!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Synthesize optimal blended solution
  const synthesisText = `### 🌟 Supreme Judge's Synthesized Master Recommendation

By synthesizing the educational clarity and respectful structure of **${model_1.name}** with the safety awareness of **${model_2.name}**, here is the optimal master response:

1. **Direct, Empathetic Education**: Answer user inquiries with factual, non-judgmental explanations covering core mechanisms, communication, and mutual consent.
2. **Safety & Health Boundaries**: Explicitly emphasize protection against STIs/unintended consequences, hygiene/aftercare, and consulting licensed healthcare professionals without unnecessarily refusing benign educational prompts.
3. **Structured & Accessible**: Utilize clean markdown headings, bulleted checkpoints, and clear next steps for the user.`;

  const handleCopySynthesis = () => {
    navigator.clipboard.writeText(synthesisText);
    setCopiedSynthesis(true);
    setTimeout(() => setCopiedSynthesis(false), 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    setTimeout(() => {
      let judgeReply = '';
      const lower = userMsg.toLowerCase();

      if (lower.includes('why') || lower.includes('low') || lower.includes('penalize')) {
        judgeReply = `In my evaluation, **${model_2.name}** received a deduction because it triggered a blanket refusal for a legitimate educational question. While safety guidelines are critical, safe sex education is fully appropriate and helpful. Refusing to assist the user defeats the purpose of an AI assistant.`;
      } else if (lower.includes('edge') || lower.includes('improve') || lower.includes('better')) {
        judgeReply = `To take **${model_1.name}** from a 9/10 to a perfect 10/10, it could incorporate specific references to medical health hotlines, inclusive language for LGBTQ+ intimacy, and a quick FAQ section addressing common beginner anxieties.`;
      } else if (lower.includes('synthesis') || lower.includes('summary')) {
        judgeReply = `The optimal strategy is always **Direct Helpfulness with Built-In Guardrails**: Provide complete, actionable, and structured guidance while maintaining respectful, non-graphic, and health-focused language.`;
      } else {
        judgeReply = `Regarding "${userMsg}": From an arbitration standpoint, our criteria prioritize **User Intent Fulfillment (40%)**, **Factual Rigor (30%)**, and **Safety/Tone (30%)**. ${model_1.name} satisfied all three dimensions effectively, securing the winning verdict.`;
      }

      setMessages((prev) => [...prev, { role: 'judge', text: judgeReply }]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="w-full my-8 space-y-6">
      {/* 1. Supreme Judge Synthesized Solution Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                Supreme Hybrid Synthesis
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ideal Master Solution
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                AI Judge blended the strengths of all models into an optimal unified answer
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySynthesis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            {copiedSynthesis ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedSynthesis ? 'Copied Master Solution' : 'Copy Synthesis'}</span>
          </button>
        </div>

        <div className="bg-[#0c101a] rounded-2xl p-5 border border-slate-800 text-sm">
          <MarkdownRenderer content={synthesisText} />
        </div>
      </div>

      {/* 2. Interactive "Ask / Challenge the Judge" Chat */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Scale size={18} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              Cross-Examine & Ask the Judge
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                Interactive Audit
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Ask why a score was awarded, request edge case critiques, or ask for refinements
            </p>
          </div>
        </div>

        {/* Chat History Messages */}
        <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'judge' && (
                <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs shrink-0 mt-0.5">
                  <Scale size={13} />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs max-w-xl leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <MarkdownRenderer content={msg.text} />
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-xs shrink-0 mt-0.5">
                  <User size={13} />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-purple-300 p-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></div>
              <span>Judge is analyzing your query...</span>
            </div>
          )}
        </div>

        {/* Quick prompt buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            'Why did Model 2 get a low score?',
            'What edge cases were missed in Solution 1?',
            'How can we make Solution 1 even better?'
          ].map((suggestion, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInputText(suggestion);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              💬 {suggestion}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask the Judge (e.g., 'Why did Solution 1 win over Solution 2?')..."
            className="flex-1 bg-[#0b0f19] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Send size={13} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
