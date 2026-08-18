"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import AnalyticsTracker from "./AnalyticsTracker";
import FeedbackModal from "./FeedbackModal";
import CommandPalette from "./CommandPalette";
import ThemeToggle from "./ThemeToggle";
import { trackSupportClick } from "../lib/analytics";

const SUPPORT_LINK = "https://rzp.io/rzp/yUV6trVJ";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <AnalyticsTracker />
      <CommandPalette />
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* Modern Minimal Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition flex items-center gap-3">
            <Logo size="sm" />
          </Link>

          <nav className="flex items-center gap-2 text-xs">
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true }))}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition"
            >
              <span>Search</span>
              <kbd className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-neutral-600 dark:text-neutral-400">
                /
              </kbd>
            </button>

            <button
              onClick={() => setFeedbackOpen(true)}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition px-2.5 py-1 rounded-md"
            >
              Feedback
            </button>

            <a
              href={SUPPORT_LINK}
              onClick={trackSupportClick}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition shadow-sm"
            >
              Support
            </a>

            <div className="pl-1 border-l border-neutral-200 dark:border-neutral-800 ml-1">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">{children}</div>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-8 text-xs text-neutral-500 transition-colors">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 dark:text-neutral-200">PrivateToolbox</span>
            <span>—</span>
            <span>Zero-upload in-browser utilities</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setFeedbackOpen(true)} className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">
              Report issue
            </button>
            <span>•</span>
            <a href={SUPPORT_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">
              Donate
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}