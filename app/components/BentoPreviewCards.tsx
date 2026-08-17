"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolIcon from "./ToolIcons";
import { sounds } from "../lib/soundEffects";

export default function BentoPreviewCards() {
  const [sliderPos, setSliderPos] = useState(50);
  const [jsonInput, setJsonInput] = useState('{"status":"verified","encryption":"AES-256"}');
  const [jsonOutput, setJsonOutput] = useState('{\n  "status": "verified",\n  "encryption": "AES-256"\n}');

  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setJsonOutput("// Invalid JSON syntax");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Flagship Bento Card: Lossless Compressor with Live Mini-Scrubber */}
      <div className="relative group p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 hover:border-indigo-500/60 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl group-hover:scale-110 group-hover:border-indigo-500/40 transition duration-300">
              <ToolIcon name="image-compressor" className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider">
                Interactive Preview
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                Lossless Image Compressor
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono">
            -72% Avg
          </span>
        </div>

        {/* Live Mini Before/After Scrubber */}
        <div className="space-y-2">
          <div
            className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-800 select-none bg-slate-950"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
              setSliderPos(pos);
            }}
          >
            {/* Compressed Side */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/50 to-pink-900/40 flex items-center justify-center">
              <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                Compressed (14.2 KB)
              </span>
            </div>

            {/* Original Side with Clip Path */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-indigo-950 flex items-center justify-center border-r-2 border-white"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <span className="text-xs font-mono text-slate-300 font-bold bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                Original (52.8 KB)
              </span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Hover to scrub split view</span>
            <span>Local Canvas Worker</span>
          </div>
        </div>

        <Link
          href="/image-compressor"
          onClick={() => sounds.playPop()}
          data-shortcut="1"
          className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 text-center text-xs font-bold text-white transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-600/20"
        >
          <span>Launch Compressor Studio</span>
          <span>→</span>
        </Link>
      </div>

      {/* 2. Flagship Bento Card: Live JSON Formatter Sandbox */}
      <div className="relative group p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 hover:border-amber-500/60 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl group-hover:scale-110 group-hover:border-amber-500/40 transition duration-300">
              <ToolIcon name="json-formatter" className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                Live Dev Sandbox
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                JSON Formatter & Validator
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
            Client-Side
          </span>
        </div>

        {/* Live Mini Formatter Input/Output */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <textarea
            rows={4}
            value={jsonInput}
            onChange={(e) => handleJsonChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-300 outline-none resize-none focus:border-amber-500/50"
            placeholder="Type minified JSON..."
          />
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-emerald-400 overflow-x-auto whitespace-pre">
            {jsonOutput}
          </div>
        </div>

        <Link
          href="/json-formatter"
          onClick={() => sounds.playPop()}
          data-shortcut="2"
          className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-amber-600 border border-slate-800 hover:border-amber-500 text-center text-xs font-bold text-white transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-amber-600/20"
        >
          <span>Open Full Dev Workspace</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}