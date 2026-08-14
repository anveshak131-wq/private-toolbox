"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import Link from "next/link";
import { diffLines, Change } from "diff";

export default function DiffCheckerPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffs, setDiffs] = useState<Change[]>([]);

  const handleCompare = () => {
    const differences = diffLines(text1, text2);
    setDiffs(differences);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-xs text-indigo-400 hover:underline">← Back to Tools</Link>
          <h1 className="text-2xl font-bold text-white mt-1">Text Diff Checker</h1>
          <p className="text-xs text-slate-400">Compare two blocks of code or text to spot additions and removals.</p>
        </div>
        <button
          onClick={handleCompare}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow"
        >
          Compare Differences
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 h-64">
        <textarea
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          placeholder="Original Text..."
          className="w-full h-full p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 resize-none outline-none focus:border-indigo-500"
        />
        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          placeholder="Modified Text..."
          className="w-full h-full p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 resize-none outline-none focus:border-indigo-500"
        />
      </div>

      {diffs.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 font-mono text-xs overflow-x-auto space-y-1">
          <div className="text-slate-400 mb-2 font-sans font-semibold">Differences:</div>
          {diffs.map((part, index) => {
            const color = part.added
              ? "bg-emerald-500/20 text-emerald-300 border-l-2 border-emerald-500"
              : part.removed
              ? "bg-rose-500/20 text-rose-300 border-l-2 border-rose-500 line-through"
              : "text-slate-400";
            return (
              <div key={index} className={`px-2 py-0.5 whitespace-pre-wrap ${color}`}>
                {part.value}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}