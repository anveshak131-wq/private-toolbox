"use client";

import React, { useState } from "react";
import { sounds } from "../lib/soundEffects";
import { copyTextToClipboard } from "../lib/downloadHelpers";

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [copiedMode, setCopiedMode] = useState<string | null>(null);

  const conversions = [
    { label: "UPPERCASE", value: text.toUpperCase() },
    { label: "lowercase", value: text.toLowerCase() },
    {
      label: "Title Case",
      value: text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()),
    },
    {
      label: "camelCase",
      value: text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()),
    },
    {
      label: "kebab-case",
      value: text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    },
    {
      label: "snake_case",
      value: text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, ""),
    },
    {
      label: "CONSTANT_CASE",
      value: text
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, ""),
    },
  ];

  const handleCopy = async (val: string, label: string) => {
    sounds.playSuccess();
    await copyTextToClipboard(val);
    setCopiedMode(label);
    setTimeout(() => setCopiedMode(null), 2000);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Batch Text Case Converter</h1>
        <p className="text-xs text-slate-400">Convert strings between programming conventions and typography styles.</p>
      </div>

      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here to convert..."
        className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-indigo-500 resize-none"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {conversions.map((item) => (
          <div
            key={item.label}
            className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
          >
            <div className="overflow-hidden">
              <div className="text-[10px] font-bold text-indigo-400 uppercase">{item.label}</div>
              <div className="text-xs font-mono text-white truncate mt-0.5">{item.value || "—"}</div>
            </div>
            <button
              onClick={() => handleCopy(item.value, item.label)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition shrink-0"
            >
              {copiedMode === item.label ? "✓ Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}