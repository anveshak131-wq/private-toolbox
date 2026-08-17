"use client";

import React from "react";
import { sounds } from "../lib/soundEffects";

interface DynamicIslandBarProps {
  itemCount: number;
  totalSavedKB?: number;
  isProcessing?: boolean;
  onDownloadAll?: () => void;
  onSendToPhone?: () => void;
  onClear?: () => void;
}

export default function DynamicIslandBar({
  itemCount,
  totalSavedKB = 0,
  isProcessing = false,
  onDownloadAll,
  onSendToPhone,
  onClear,
}: DynamicIslandBarProps) {
  if (itemCount === 0 && !isProcessing) return null;

  return (
    <aside
      aria-label="Workspace Actions"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-in slide-in-from-bottom-6"
    >
      {/* State A: Processing spinner */}
      {isProcessing ? (
        <div className="flex items-center gap-3 py-1">
          <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-indigo-300 font-semibold">Processing Canvas Pixels...</span>
        </div>
      ) : (
        /* State B: Metrics & Action controls */
        <>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white font-mono">
              {itemCount} {itemCount === 1 ? "file" : "files"}
            </span>
            {totalSavedKB > 0 && (
              <span className="hidden sm:inline text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                -{(totalSavedKB / 1024).toFixed(1)} MB saved
              </span>
            )}
          </div>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {onSendToPhone && (
            <button
              onClick={() => {
                sounds.playPop();
                onSendToPhone();
              }}
              data-shortcut="P"
              className="relative px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30 transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span className="hidden sm:inline">Beam to Phone</span>
            </button>
          )}

          {onDownloadAll && (
            <button
              onClick={() => {
                sounds.playSuccess();
                onDownloadAll();
              }}
              data-shortcut="D"
              className="relative px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-xs transition shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download (.ZIP)</span>
            </button>
          )}

          {onClear && (
            <button
              onClick={() => {
                sounds.playPop();
                onClear();
              }}
              data-shortcut="Esc"
              className="relative text-xs text-slate-400 hover:text-rose-400 transition px-2 py-1"
            >
              Clear
            </button>
          )}
        </>
      )}
    </aside>
  );
}