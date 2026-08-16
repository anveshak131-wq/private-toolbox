"use client";

import React, { useState } from "react";
import { sounds } from "../lib/soundEffects";

export default function ColorContrastSimulatorPage() {
  const [fgColor, setFgColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#4f46e5");

  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const l1 = getLuminance(fgColor);
  const l2 = getLuminance(bgColor);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  const aaPass = ratio >= 4.5;
  const aaaPass = ratio >= 7.0;

  return (
    <main className="max-w-xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">WCAG Color Contrast Checker</h1>
        <p className="text-xs text-slate-400">Verify accessibility compliance scores (AA / AAA) for typography and backgrounds.</p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div
          className="p-8 rounded-2xl text-center space-y-2 shadow-inner border border-white/10"
          style={{ backgroundColor: bgColor, color: fgColor }}
        >
          <div className="text-xl font-bold">Sample Preview Heading</div>
          <p className="text-xs opacity-90 max-w-xs mx-auto">This text renders with live WCAG contrast ratios against the background canvas.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Text Color</label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold">Contrast Ratio</div>
            <div className="text-lg font-black text-white">{ratio.toFixed(2)}:1</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold">WCAG AA</div>
            <div className={`text-lg font-black ${aaPass ? "text-emerald-400" : "text-rose-400"}`}>
              {aaPass ? "✓ Pass" : "✕ Fail"}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold">WCAG AAA</div>
            <div className={`text-lg font-black ${aaaPass ? "text-emerald-400" : "text-rose-400"}`}>
              {aaaPass ? "✓ Pass" : "✕ Fail"}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}