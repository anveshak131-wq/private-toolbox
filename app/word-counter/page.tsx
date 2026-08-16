"use client";

import React, { useState } from "react";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s+/g, "").length;
  const readingTime = Math.ceil(words / 200); // 200 wpm
  const speakingTime = Math.ceil(words / 130); // 130 wpm

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Word & Read-Time Analytics</h1>
        <p className="text-xs text-slate-400">Calculate speech duration, read times, and characters locally.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
          <div className="text-xs text-slate-400 font-semibold">Total Words</div>
          <div className="text-2xl font-black text-white mt-1">{words}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
          <div className="text-xs text-slate-400 font-semibold">Characters</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{chars}</div>
          <div className="text-[10px] text-slate-500">{charsNoSpaces} (no spaces)</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
          <div className="text-xs text-slate-400 font-semibold">Read Time</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{readingTime} min</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
          <div className="text-xs text-slate-400 font-semibold">Speaking Time</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{speakingTime} min</div>
        </div>
      </div>

      <textarea
        rows={12}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type content here for real-time telemetry metrics..."
        className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-5 text-xs text-white outline-none focus:border-indigo-500 resize-none leading-relaxed"
      />
    </main>
  );
}