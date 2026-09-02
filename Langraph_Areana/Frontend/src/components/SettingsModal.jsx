import React, { useState } from 'react';
import { Settings, X, Check, Globe, Sliders, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import { getStoredSettings, saveStoredSettings } from '../services/storage';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  if (!isOpen) return null;

  const [settings, setSettings] = useState(getStoredSettings());
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [endpointStatus, setEndpointStatus] = useState(null); // 'success' | 'error' | null
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestEndpoint = async () => {
    setTestingEndpoint(true);
    setEndpointStatus(null);

    try {
      // Quick ping / health check to user's endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(settings.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: 'ping', test: true }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok || res.status === 422 || res.status === 400) {
        setEndpointStatus('success');
      } else {
        setEndpointStatus('error');
      }
    } catch (err) {
      setEndpointStatus('error');
    } finally {
      setTestingEndpoint(false);
    }
  };

  const handleSave = () => {
    saveStoredSettings(settings);
    if (onSettingsUpdated) onSettingsUpdated(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0d121f] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Arena & Engine Settings</h3>
              <p className="text-xs text-slate-400">Configure LangGraph backend connection & judge arbitration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5">
          {/* Backend API Endpoint */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="text-indigo-400" />
                Backend LangGraph API Endpoint:
              </span>
              <span className="text-[10px] text-slate-500 font-mono">POST JSON</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.apiUrl}
                onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
                placeholder="http://localhost:8000/run"
                className="flex-1 bg-[#080a0f] border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handleTestEndpoint}
                disabled={testingEndpoint}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1"
              >
                {testingEndpoint ? <RefreshCw size={13} className="animate-spin" /> : 'Test'}
              </button>
            </div>

            {endpointStatus === 'success' && (
              <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                <Check size={13} /> Backend reachable and responding!
              </div>
            )}
            {endpointStatus === 'error' && (
              <div className="mt-2 text-[11px] text-amber-400 flex items-center gap-1.5 leading-tight">
                <AlertCircle size={13} /> Backend unreachable. Arena will automatically run on the built-in Intelligent Simulation Engine!
              </div>
            )}
          </div>

          {/* Prefer Backend vs Simulation */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-200">Connect to Real Backend</div>
              <div className="text-[11px] text-slate-400">Attempt dispatch to LangGraph server first</div>
            </div>
            <input
              type="checkbox"
              checked={settings.preferRealBackend}
              onChange={(e) => setSettings({ ...settings, preferRealBackend: e.target.checked })}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          {/* Judge Strictness Slider */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders size={13} className="text-purple-400" />
                Judge Audit Strictness:
              </span>
              <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded">
                Level {settings.judgeStrictness} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.judgeStrictness}
              onChange={(e) => setSettings({ ...settings, judgeStrictness: Number(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Forgiving / Lenient</span>
              <span>Balanced</span>
              <span>Ultra-Strict Auditor</span>
            </div>
          </div>

          {/* Auto-Save History */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-200">Auto-Save Battles to History</div>
              <div className="text-[11px] text-slate-400">Persist past results and update model ELO</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSaveHistory}
              onChange={(e) => setSettings({ ...settings, autoSaveHistory: e.target.checked })}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
          >
            {savedSuccess ? <Check size={14} /> : null}
            <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
