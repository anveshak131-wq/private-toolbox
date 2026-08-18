"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import AnalyticsTracker from "./AnalyticsTracker";
import FeedbackModal from "./FeedbackModal";
import CommandPalette from "./CommandPalette";
import PrivacyGauge from "./PrivacyGauge";
import ShortcutRadar from "./ShortcutRadar";
import ThemeToggle from "./ThemeToggle";
import { trackSupportClick } from "../lib/analytics";
import { sounds } from "../lib/soundEffects";

const SUPPORT_LINK = "https://rzp.io/rzp/yUV6trVJ";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <AnalyticsTracker />
      <CommandPalette />
      <ShortcutRadar />
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* Global Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/75 dark:bg-neutral-950/75 backdrop-blur-xl transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" onClick={() => sounds?.playPop?.()} className="hover:opacity-90 transition">
              <Logo size="md" />
            </Link>
            <PrivacyGauge />
          </div>

          <nav className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
            {/* Theme Toggle (Light / Dark / System) */}
            <ThemeToggle />

            {/* Quick Find */}
            <button
              onClick={() => {
                sounds?.playPop?.();
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true }));
              }}
              data-shortcut="/"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition relative"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Quick Find</span>
              <kbd className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 font-mono">
                /
              </kbd>
            </button>

            {/* Feedback Button */}
            <button
              onClick={() => {
                sounds?.playPop?.();
                setFeedbackOpen(true);
              }}
              data-shortcut="F"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition px-3 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center gap-1.5 relative border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
            >
              <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Feedback</span>
            </button>

            {/* Support CTA */}
            <a
              href={SUPPORT_LINK}
              onClick={() => {
                sounds?.playSuccess?.();
                trackSupportClick();
              }}
              target="_blank"
              rel="noopener noreferrer"
              data-shortcut="S"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm font-medium relative hover:scale-105 active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
              <span>Support</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Page Content */}
      <div className="flex-1">{children}</div>

      {/* Floating Quick Support Pill */}
      <a
        href={SUPPORT_LINK}
        onClick={() => {
          sounds?.playSuccess?.();
          trackSupportClick();
        }}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-white/90 dark:bg-neutral-900/90 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 px-4 py-2 rounded-full shadow-lg shadow-black/5 dark:shadow-black/40 backdrop-blur-md text-xs font-semibold transition-all hover:scale-105"
      >
        <svg className="w-4 h-4 text-amber-500 dark:text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
        <span>Support Project</span>
      </a>

      {/* Global Footer */}
      <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md py-8 text-center text-xs text-neutral-500 dark:text-neutral-400 transition-colors">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-semibold text-neutral-800 dark:text-neutral-300">PrivateToolbox</span>
            <span>•</span>
            <span>100% Client-Side In-Memory Execution</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
            <button
              onClick={() => {
                sounds?.playPop?.();
                setFeedbackOpen(true);
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Suggest a Tool / Report Bug
            </button>
            <span>•</span>
            <a
              href={SUPPORT_LINK}
              onClick={trackSupportClick}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Donate / Support
            </a>
            <span>•</span>
            <p className="text-neutral-400 dark:text-neutral-600">
              © {new Date().getFullYear()} PrivateToolbox
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}