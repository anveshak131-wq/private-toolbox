"use client";

import React, { useState, useEffect } from "react";

export default function FingerprintAnalyzerPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // WebGL Vendor Extraction
    let renderer = "N/A";
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      const debugInfo = (gl as any)?.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    } catch {}

    setData({
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenRes: `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x)`,
      colorDepth: `${window.screen.colorDepth}-bit`,
      cores: (navigator as any).hardwareConcurrency || "Unknown",
      memoryGB: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "Protected",
      gpuRenderer: renderer,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Browser Fingerprint Inspector</h1>
        <p className="text-xs text-slate-400">Inspect the hardware and sandbox identifiers your browser exposes to websites.</p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-3 font-mono text-xs">
        {data ? (
          Object.entries(data).map(([key, val]: any) => (
            <div key={key} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between gap-4">
              <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="text-white font-bold text-right truncate max-w-xs">{val}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-500">Analyzing sandbox headers...</div>
        )}
      </div>
    </main>
  );
}