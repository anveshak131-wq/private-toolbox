"use client";

import React, { useState } from "react";
import { sounds } from "../lib/soundEffects";
import { copyTextToClipboard } from "../lib/downloadHelpers";

const INITIAL_MD = `# Markdown Document
An **in-browser** Markdown editor and HTML generator.

### Key Capabilities
* 100% Client-side formatting
* Instant HTML export
* Zero network telemetry
`;

export default function MarkdownPreviewPage() {
  const [md, setMd] = useState(INITIAL_MD);
  const [copied, setCopied] = useState(false);

  // Sanitized parser for bold, headers, and lists (prevents DOM XSS injection)
  const renderSimpleHtml = (text: string) => {
    const sanitized = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    return sanitized
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-indigo-300 mt-3 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-4 mb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-white mt-2 mb-2">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 text-xs">$1</li>')
      .replace(/\n/gim, '<br />');
  };

  const handleCopyHtml = async () => {
    sounds.playSuccess();
    await copyTextToClipboard(renderSimpleHtml(md));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Markdown Live Preview</h1>
          <p className="text-xs text-slate-400">Write markdown and preview or export compiled HTML in real-time.</p>
        </div>
        <button
          onClick={handleCopyHtml}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
        >
          {copied ? "✓ Copied HTML" : "Copy HTML"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[65vh]">
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          className="w-full h-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 outline-none resize-none focus:border-indigo-500"
          placeholder="Type Markdown here..."
        />
        <div
          className="w-full h-full bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-y-auto text-xs text-slate-300 space-y-1"
          dangerouslySetInnerHTML={{ __html: renderSimpleHtml(md) }}
        />
      </div>
    </main>
  );
}