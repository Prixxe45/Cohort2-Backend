import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Render paragraphs, headers, bullet points, and code blocks
  const parseMarkdown = (text) => {
    // Break into code blocks vs non-code blocks
    const parts = [];
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: text.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'code', lang: match[1] || 'text', code: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', value: text.substring(lastIndex) });
    }

    return parts;
  };

  const renderTextSegment = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Headers
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-indigo-300 mt-4 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block"></span>
            {renderInline(trimmed.substring(4))}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg font-bold text-white mt-5 mb-2 border-b border-slate-700/50 pb-1 flex items-center gap-2">
            <span className="w-2 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-sm inline-block"></span>
            {renderInline(trimmed.substring(3))}
          </h2>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-xl font-extrabold text-white mt-6 mb-3">
            {renderInline(trimmed.substring(2))}
          </h1>
        );
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-indigo-500/80 bg-indigo-950/20 px-3 py-2 rounded-r my-2 text-slate-300 text-sm italic">
            {renderInline(trimmed.substring(2))}
          </blockquote>
        );
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-sm leading-relaxed mb-1 pl-1">
            {renderInline(trimmed.substring(2))}
          </li>
        );
      }

      // Numbered lists
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="ml-2 flex items-start gap-2 text-slate-200 text-sm leading-relaxed mb-1.5">
            <span className="font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 rounded px-1.5 py-0.5 text-xs">
              {numMatch[1]}
            </span>
            <div className="flex-1">{renderInline(numMatch[2])}</div>
          </div>
        );
      }

      // Empty lines
      if (trimmed === '') {
        return <div key={idx} className="h-2"></div>;
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-slate-300 text-sm leading-relaxed mb-2">
          {renderInline(line)}
        </p>
      );
    });
  };

  const renderInline = (str) => {
    // Convert bold **text** or *text* and inline `code`
    const tokens = [];
    const inlineRegex = /(\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
    let last = 0;
    let m;

    while ((m = inlineRegex.exec(str)) !== null) {
      if (m.index > last) {
        tokens.push(str.substring(last, m.index));
      }
      if (m[2]) {
        // Bold
        tokens.push(<strong key={m.index} className="text-white font-semibold">{m[2]}</strong>);
      } else if (m[3]) {
        // Inline code
        tokens.push(
          <code key={m.index} className="bg-slate-900 border border-slate-700/60 text-sky-300 text-xs px-1.5 py-0.5 rounded font-mono">
            {m[3]}
          </code>
        );
      } else if (m[4]) {
        // Italic
        tokens.push(<em key={m.index} className="text-slate-300 italic">{m[4]}</em>);
      }
      last = m.index + m[0].length;
    }

    if (last < str.length) {
      tokens.push(str.substring(last));
    }

    return tokens.length > 0 ? tokens : str;
  };

  const parts = parseMarkdown(content);

  return (
    <div className="space-y-1 select-text">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} code={part.code} lang={part.lang} />;
        }
        return <div key={index}>{renderTextSegment(part.value)}</div>;
      })}
    </div>
  );
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-slate-700/60 bg-[#0c101a] shadow-lg">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <span className="font-mono text-indigo-300 uppercase tracking-wider">{lang || 'CODE'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 text-xs text-slate-200 font-mono overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
