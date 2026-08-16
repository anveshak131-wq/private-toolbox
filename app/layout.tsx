"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Logo from "./components/Logo";
import AnalyticsTracker from "./components/AnalyticsTracker";
import FeedbackModal from "./components/FeedbackModal";
import CommandPalette from "./components/CommandPalette";
import PrivacyGauge from "./components/PrivacyGauge";
import Link from "next/link";
import { trackSupportClick } from "./lib/analytics";
import { sounds } from "./lib/soundEffects";

const inter = Inter({ subsets: ["latin"] });
const SUPPORT_LINK = "https://rzp.io/rzp/yUV6trVJ";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        <AnalyticsTracker />
        <CommandPalette />
        <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" onClick={() => sounds.playPop()} className="hover:opacity-90 transition">
                <Logo size="md" />
              </Link>
              {/* Zero-Server Privacy Gauge */}
              <PrivacyGauge />
            </div>

            <nav className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
              <button
                onClick={() => {
                  sounds.playPop();
                  window.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true }));
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <span>🔍 Quick Find</span>
                <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                  /
                </kbd>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setFeedbackOpen(true);
                }}
                className="text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-900"
              >
                Request Tool
              </button>

              <a
                href={SUPPORT_LINK}
                onClick={() => {
                  sounds.playSuccess();
                  trackSupportClick();
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm font-medium"
              >
                <span>☕</span>
                <span>Support</span>
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">{children}</div>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-semibold text-slate-400">PrivateToolbox</span>
              <span>•</span>
              <span>100% Client-Side In-Memory Execution</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <button
                onClick={() => {
                  sounds.playPop();
                  setFeedbackOpen(true);
                }}
                className="hover:text-indigo-400 transition"
              >
                Suggest a Tool / Report Bug
              </button>
              <span>•</span>
              <a
                href={SUPPORT_LINK}
                onClick={trackSupportClick}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition"
              >
                Donate / Support
              </a>
              <span>•</span>
              <p className="text-slate-600">
                © {new Date().getFullYear()} PrivateToolbox
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}