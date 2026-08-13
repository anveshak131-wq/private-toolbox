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
      // Fallback: Copy current URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-8 px-6 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Privacy Statement */}
        <div className="text-center md:text-left space-y-1">
          <p className="font-semibold text-slate-200">
            🔒 Private Web Utility Toolbox
          </p>
          <p className="text-slate-500">
            All processing happens locally in your browser. Zero server uploads.
          </p>
        </div>

        {/* Interactive Buttons: Tip Jar + Share */}
        <div className="flex items-center gap-3">
          {/* Tip Jar Button */}
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 px-4 py-2 rounded-xl font-medium transition"
          >
            <span>☕</span>
            <span>Buy me a coffee</span>
          </a>

          {/* Social Share / Copy Link Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 px-4 py-2 rounded-xl font-medium transition"
          >
            <span>🔗</span>
            <span>{copied ? "Link Copied!" : "Share Tool"}</span>
          </button>
        </div>

      </div>
    </footer>
  );
}