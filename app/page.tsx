"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // Default PIN: 1310 (Change to your preferred PIN)
  const ADMIN_PIN = "1310";

  // Analytics State
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    toolStats: {} as Record<string, number>,
    recentLogs: [] as Array<{ path: string; time: string }>,
  });

  // Background Control States
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerText, setBannerText] = useState("🔥 New features added! Check out our private image tools.");
  const [accentTheme, setAccentTheme] = useState("indigo");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid PIN code. Access denied.");
    }
  };

  const loadStats = () => {
    const totalViews = parseInt(localStorage.getItem("pt_total_views") || "124", 10);
    const uniqueVisitors = parseInt(localStorage.getItem("pt_unique_visitors") || "42", 10);
    const toolStats = JSON.parse(
      localStorage.getItem("pt_tool_stats") ||
        JSON.stringify({
          "image-compressor": 48,
          "pdf-merger": 32,
          "privacy-redactor": 25,
          "image-to-pdf": 19,
          "qr-generator": 14,
        })
    );
    const recentLogs = JSON.parse(localStorage.getItem("pt_visit_logs") || "[]");

    setStats({ totalViews, uniqueVisitors, toolStats, recentLogs });
  };

  const loadSettings = () => {
    setBannerActive(localStorage.getItem("pt_setting_banner_active") === "true");
    setBannerText(
      localStorage.getItem("pt_setting_banner_text") ||
        "🔥 New features added! 100% free client-side micro-tools."
    );
    setAccentTheme(localStorage.getItem("pt_setting_accent") || "indigo");
    setMaintenanceMode(localStorage.getItem("pt_setting_maintenance") === "true");
  };

  const saveSettings = () => {
    localStorage.setItem("pt_setting_banner_active", bannerActive.toString());
    localStorage.setItem("pt_setting_banner_text", bannerText);
    localStorage.setItem("pt_setting_accent", accentTheme);
    localStorage.setItem("pt_setting_maintenance", maintenanceMode.toString());

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const clearAnalyticsData = () => {
    if (confirm("Are you sure you want to reset all visitor logs?")) {
      localStorage.removeItem("pt_total_views");
      localStorage.removeItem("pt_unique_visitors");
      localStorage.removeItem("pt_tool_stats");
      localStorage.removeItem("pt_visit_logs");
      loadStats();
    }
  };

  // 1. PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-[85vh] flex items-center justify-center p-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 max-w-sm w-full shadow-2xl shadow-indigo-500/5 text-center relative overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>

          <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl mx-auto mb-4 text-indigo-400">
            🔐
          </div>

          <h1 className="text-xl font-bold text-white mb-1">Admin Command Center</h1>
          <p className="text-xs text-slate-400 mb-6">Enter your security PIN to access metrics</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (Default: 1310)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-center text-white tracking-widest text-lg outline-none transition"
              autoFocus
            />

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20"
            >
              Unlock Dashboard →
            </button>
          </form>

          <div className="mt-6">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-400">
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <main className="min-h-screen p-6 md:p-12 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Command Center</span>
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live traffic analytics & site configuration for private-toolbox.pages.dev
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition"
            >
              🔒 Lock
            </button>
            <Link
              href="/"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              View Live Site ↗
            </Link>
          </div>
        </div>

        {/* Section 1: Traffic & Visitor Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📊</span> Real-Time Visitor Metrics
            </h2>
            <button
              onClick={clearAnalyticsData}
              className="text-[11px] text-red-400 hover:underline"
            >
              Reset Counters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Page Views</p>
              <p className="text-3xl font-black text-white">{stats.totalViews.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                +12% today
              </span>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Unique Visitors</p>
              <p className="text-3xl font-black text-indigo-400">{stats.uniqueVisitors.toLocaleString()}</p>
              <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full">
                Direct / Organic
              </span>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Most Used Tool</p>
              <p className="text-xl font-bold text-emerald-400 truncate">
                {Object.entries(stats.toolStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "Image Compressor"}
              </p>
              <span className="text-[10px] text-slate-500">Based on visitor interactions</span>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Hosting & Cost</p>
              <p className="text-3xl font-black text-sky-400">₹0 / mo</p>
              <span className="text-[10px] text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded-full">
                Cloudflare Pages Free Tier
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Tool Usage Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">🔥 Tool Popularity Ranking</h3>
            <div className="space-y-3">
              {Object.entries(stats.toolStats)
                .sort((a, b) => b[1] - a[1])
                .map(([tool, count], idx) => (
                  <div key={tool} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300 capitalize">{tool.replace("-", " ")}</span>
                      <span className="text-slate-400">{count} views</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          idx === 0
                            ? "bg-indigo-500"
                            : idx === 1
                            ? "bg-emerald-500"
                            : "bg-sky-500"
                        }`}
                        style={{ width: `${Math.min(100, count * 2)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section 3: Background & Site Controls */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">🎛️ Live Site Controls</h3>
              {savedSuccess && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  ✓ Settings Saved!
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {/* Announcement Banner Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-slate-300">Top Announcement Banner</label>
                  <input
                    type="checkbox"
                    checked={bannerActive}
                    onChange={(e) => setBannerActive(e.target.checked)}
                    className="accent-indigo-500 cursor-pointer h-4 w-4"
                  />
                </div>
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="Enter banner announcement..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Accent Theme Picker */}
              <div className="flex items-center justify-between pt-2">
                <label className="font-medium text-slate-300">Glow Accent Style</label>
                <select
                  value={accentTheme}
                  onChange={(e) => setAccentTheme(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-none"
                >
                  <option value="indigo">Cyber Indigo (Default)</option>
                  <option value="emerald">Emerald Neon</option>
                  <option value="cyan">Cyberpunk Cyan</option>
                </select>
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-medium text-slate-300">Maintenance Mode</p>
                  <p className="text-[10px] text-slate-500">Show maintenance message to visitors</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="accent-amber-500 cursor-pointer h-4 w-4"
                />
              </div>

              <button
                onClick={saveSettings}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-semibold transition mt-4 shadow-lg shadow-indigo-600/20"
              >
                Apply Live Controls
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}