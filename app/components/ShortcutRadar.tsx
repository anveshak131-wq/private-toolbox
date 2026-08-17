"use client";

import React, { useState, useEffect } from "react";
import { sounds } from "../lib/soundEffects";

export default function ShortcutRadar() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt" || e.key === "Option") {
        timer = setTimeout(() => {
          sounds.playPop();
          setActive(true);
        }, 150);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt" || e.key === "Option") {
        clearTimeout(timer);
        setActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none animate-in fade-in duration-150">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/50 shadow-2xl backdrop-blur-xl text-[11px] font-mono font-bold text-indigo-300 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
        <span>Keyboard Shortcut Radar Active</span>
      </div>

      <style>{`
        [data-shortcut]::after {
          content: attr(data-shortcut);
          position: absolute;
          top: -8px;
          right: -8px;
          background: #4f46e5;
          color: white;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 6px;
          border: 1px solid #818cf8;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          z-index: 60;
          animation: badge-pop 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes badge-pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}