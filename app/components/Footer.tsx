"use client";

import React, { useState } from "react";

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
          {/* Razorpay UPI Link */}
          <a
            href="https://rzp.io/rzp/8cfXzWMY"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-xl font-semibold transition"
          >
            <span>⚡</span>
            <span>Support via UPI</span>
          </a>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold transition shadow-md shadow-indigo-600/20"
          >
            <span>🔗</span>
            <span>{copied ? "Link Copied!" : "Share Website"}</span>
          </button>
        </div>

      </div>
    </footer>
  );
}