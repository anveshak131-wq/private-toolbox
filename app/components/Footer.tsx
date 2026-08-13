"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Private Web Utility Toolbox",
      text: "Fast, free, and 100% private web tools. Files never leave your browser!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-8 px-6 mt-auto relative z-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="text-center md:text-left space-y-1">
          <p className="font-bold text-slate-200 tracking-tight">
            🔒 Private Web Utility Toolbox
          </p>
          <p className="text-slate-500">
            Powered by WebAssembly & Client-Side JavaScript. No file uploads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 px-4 py-2 rounded-xl font-semibold transition"
          >
            <span>☕</span>
            <span>Tip Jar</span>
          </a>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 px-4 py-2 rounded-xl font-semibold transition"
          >
            <span>🔗</span>
            <span>{copied ? "Link Copied!" : "Share Site"}</span>
          </button>
        </div>

      </div>
    </footer>
  );
}