"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import Link from "next/link";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number = 2) => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-xs text-indigo-400 hover:underline">← Back to Tools</Link>
          <h1 className="text-2xl font-bold text-white mt-1">JSON Formatter & Validator</h1>
          <p className="text-xs text-slate-400">Validate, beautify, or minify JSON data entirely client-side.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => formatJson(2)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold">Prettify (2 Spaces)</button>
          <button onClick={() => formatJson(4)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold">4 Spaces</button>
          <button onClick={minifyJson} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold">Minify</button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
          <strong>Syntax Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[550px]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste raw JSON here..."
          className="w-full h-full p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 resize-none outline-none focus:border-indigo-500"
        />
        <div className="relative h-full">
          <textarea
            readOnly
            value={output}
            placeholder="Formatted output will appear here..."
            className="w-full h-full p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs font-mono text-emerald-400 resize-none outline-none"
          />
          {output && (
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700"
            >
              {copied ? "✓ Copied" : "Copy Output"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}