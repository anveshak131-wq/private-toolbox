"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Logo from "./components/Logo";
import AnalyticsTracker from "./components/AnalyticsTracker";
import FeedbackModal from "./components/FeedbackModal";
import Link from "next/link";
import { trackSupportClick } from "./lib/analytics";

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
        <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="hover:opacity-90 transition">
              <Logo size="md" />
            </Link>

            <nav className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Zero Data Stored</span>
              </div>

              <Link
                href="/"
                className="text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-900"
              >
                All Tools
              </Link>

              <button
                onClick={() => setFeedbackOpen(true)}
                className="text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-900"
              >
                Request Tool
              </button>

              <a
                href={SUPPORT_LINK}
                onClick={trackSupportClick}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm font-medium"
              >
                <span>☕</span>
                <span>Support</span>
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1">{children}</div>

        {/* Floating Support Badge */}
        <a
          href={SUPPORT_LINK}
          onClick={trackSupportClick}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500 text-white px-4 py-2 rounded-full shadow-xl shadow-black/40 backdrop-blur-md text-xs font-semibold transition-all hover:scale-105"
        >
          <span className="text-sm">☕</span>
          <span>Support Project</span>
        </a>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-semibold text-slate-400">PrivateToolbox</span>
              <span>•</span>
              <span>All operations execute locally in your browser memory</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <button
                onClick={() => setFeedbackOpen(true)}
                className="hover:text-indigo-400 transition"
              >
                Suggest a Tool / Bug Report
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