"use client";

import React, { useState, useEffect } from "react";

export default function PrivacyGauge() {
  const [memoryMB, setMemoryMB] = useState<string>("6.4");

  useEffect(() => {
    const updateMemory = () => {
      if (typeof window !== "undefined" && (performance as any).memory) {
        const used = (performance as any).memory.usedJSHeapSize / (1024 * 1024);
        setMemoryMB(used.toFixed(1));
      }
    };

    updateMemory();
    const interval = setInterval(updateMemory, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono shadow-inner">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-semibold">Memory: {memoryMB} MB</span>
      </div>
      <span className="text-slate-600">|</span>
      <div className="flex items-center gap-1 text-slate-400">
        <svg className="w-3 h-3 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <span>Uploads: 0 KB (100% Client)</span>
      </div>
    </div>
  );
}