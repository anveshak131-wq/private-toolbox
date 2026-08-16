"use client";

export const dynamic = "force-static";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import {
  getAnalyticsData,
  getSiteConfig,
  updateSiteConfig,
  resetAnalyticsData,
  logAdminLogin,
  SiteConfig,
} from "../lib/analytics";

// List of Google Accounts authorized to access the dashboard
const AUTHORIZED_ADMIN_EMAILS = [
  "anveshkoganti54@gmail.com",
];

const ALL_TOOLS = [
  { id: "image-compressor", name: "Image Compressor" },
  { id: "pdf-merger", name: "PDF Merger" },
  { id: "pdf-organizer", name: "PDF Splitter & Deletor" },
  { id: "image-to-pdf", name: "Image to PDF" },
  { id: "image-resizer", name: "Image Resizer" },
  { id: "privacy-redactor", name: "Privacy Redactor" },
  { id: "json-formatter", name: "JSON Formatter" },
  { id: "diff-checker", name: "Text Diff Checker" },
  { id: "base64-codec", name: "Base64 Codec" },
  { id: "svg-converter", name: "SVG Converter" },
  { id: "heic-converter", name: "HEIC to JPEG Converter" },
  { id: "qr-generator", name: "QR Code Generator" },
];

export default function AdminControlPanel() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"metrics" | "tools" | "announcement" | "errors" | "audit">("metrics");
  const [data, setData] = useState<any>(null);
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig());

  // Listen to Supabase OAuth State
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleUserSession(session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUserSession = (currentUser: any) => {
    setUser(currentUser);
    if (currentUser?.email && AUTHORIZED_ADMIN_EMAILS.includes(currentUser.email)) {
      setIsAuthorized(true);
      logAdminLogin();
      refreshData();
    } else {
      setIsAuthorized(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/vault-x9k2p-control-panel",
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthorized(false);
  };

  const refreshData = () => {
    setData(getAnalyticsData());
    setConfig(getSiteConfig());
  };

  const toggleTool = (toolId: string) => {
    const isCurrentlyDisabled = config.disabledTools.includes(toolId);
    const updatedDisabled = isCurrentlyDisabled
      ? config.disabledTools.filter((id) => id !== toolId)
      : [...config.disabledTools, toolId];

    const newConfig = { ...config, disabledTools: updatedDisabled };
    setConfig(newConfig);
    updateSiteConfig(newConfig);
  };

  const saveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(config);
    alert("Announcement configuration updated successfully!");
  };

  const exportDataJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const dl = document.createElement("a");
    dl.setAttribute("href", jsonString);
    dl.setAttribute("download", `privatetoolbox-analytics-${Date.now()}.json`);
    dl.click();
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to purge all analytics logs?")) {
      resetAnalyticsData();
      refreshData();
    }
  };

  if (loading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center">
        <div className="text-xs text-indigo-400 font-semibold animate-pulse">
          Authenticating Master Session...
        </div>
      </main>
    );
  }

  // Auth Gate
  if (!user || !isAuthorized) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl max-w-sm w-full space-y-6 text-center shadow-2xl backdrop-blur-xl">
          <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            🛡️
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Master Control Vault</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in with an authorized administrator Google account</p>
          </div>

          {user && !isAuthorized && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
              Account <strong>{user.email}</strong> is not authorized for master access.
            </div>
          )}

          <button
            onClick={user ? handleSignOut : handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl text-xs border border-slate-700 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
              />
            </svg>
            <span>{user ? "Sign in with different account" : "Continue with Google"}</span>
          </button>
        </div>
      </main>
    );
  }

  const supportConversionRate = data?.totalViews
    ? (((data.supportClicks || 0) / data.totalViews) * 100).toFixed(2)
    : "0.00";

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Authenticated: {user.email}
          </div>
          <h1 className="text-2xl font-black text-white">Vault Master Control</h1>
          <p className="text-xs text-slate-400">Manage real-time analytics, tool availability, announcements, and errors.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportDataJSON}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Export JSON
          </button>
          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
        {[
          { id: "metrics", label: "📊 Usage & Metrics" },
          { id: "tools", label: "⚙️ Tool Killswitches" },
          { id: "announcement", label: "📢 Global Announcement" },
          { id: "errors", label: "🚨 Caught Errors" },
          { id: "audit", label: "🛡️ Audit Trail" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: METRICS & CONVERSIONS */}
      {activeTab === "metrics" && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-semibold">Total Page Impressions</div>
              <div className="text-3xl font-black text-white mt-1">{data.totalViews}</div>
              <div className="text-[10px] text-slate-500 mt-1">Stored in client telemetry</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-semibold">Support Link Clicks</div>
              <div className="text-3xl font-black text-indigo-400 mt-1">{data.supportClicks || 0}</div>
              <div className="text-[10px] text-slate-500 mt-1">Razorpay donation interest</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-semibold">Support Conversion Rate</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">{supportConversionRate}%</div>
              <div className="text-[10px] text-slate-500 mt-1">Clicks per total views</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Tool Popularity Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(data.toolViews || {}).length === 0 && (
                <p className="text-xs text-slate-500">No tool usage recorded yet.</p>
              )}
              {Object.entries(data.toolViews || {}).map(([tool, count]: any) => {
                const percentage = data.totalViews ? Math.round((count / data.totalViews) * 100) : 0;
                return (
                  <div key={tool} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">/{tool}</span>
                      <span className="text-slate-400">{count} views ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Object.entries(data.deviceStats || {}).map(([dev, cnt]: any) => (
              <div key={dev} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl text-center">
                <div className="text-xs text-slate-400 font-semibold">{dev}</div>
                <div className="text-xl font-bold text-white mt-1">{cnt}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleResetData}
              className="text-xs text-rose-400 hover:underline"
            >
              Purge All Analytics Records
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: TOOL TOGGLES */}
      {activeTab === "tools" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Remote Tool Availability</h3>
            <p className="text-xs text-slate-400">Toggle any tool off to mark it under maintenance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {ALL_TOOLS.map((tool) => {
              const isDisabled = config.disabledTools.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{tool.name}</div>
                    <div className="text-[10px] text-slate-400">/{tool.id}</div>
                  </div>
                  <button
                    onClick={() => toggleTool(tool.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      isDisabled
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {isDisabled ? "Disabled" : "Active"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL ANNOUNCEMENT */}
      {activeTab === "announcement" && (
        <form onSubmit={saveAnnouncement} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Site-wide Notification Banner</h3>
            <p className="text-xs text-slate-400">Broadcast maintenance alerts or update messages across all pages.</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enableBanner"
              checked={config.announcement.enabled}
              onChange={(e) =>
                setConfig({
                  ...config,
                  announcement: { ...config.announcement, enabled: e.target.checked },
                })
              }
              className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="enableBanner" className="text-xs font-semibold text-white">
              Display Announcement Banner
            </label>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Banner Text</label>
            <input
              type="text"
              value={config.announcement.message}
              onChange={(e) =>
                setConfig({
                  ...config,
                  announcement: { ...config.announcement, message: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
              placeholder="Enter announcement message..."
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Banner Type / Theme</label>
            <select
              value={config.announcement.type}
              onChange={(e: any) =>
                setConfig({
                  ...config,
                  announcement: { ...config.announcement, type: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="info">Info (Indigo)</option>
              <option value="warning">Warning / Maintenance (Amber)</option>
              <option value="success">Success / New Feature (Emerald)</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition"
          >
            Save Announcement Settings
          </button>
        </form>
      )}

      {/* TAB 4: CAUGHT ERRORS */}
      {activeTab === "errors" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Client-Side Error Log</h3>
            <p className="text-xs text-slate-400">Recent unhandled runtime exceptions or file processing errors.</p>
          </div>

          {(!data?.errorLogs || data.errorLogs.length === 0) ? (
            <p className="text-xs text-emerald-400">✓ No client-side exceptions recorded.</p>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {data.errorLogs.map((log: any) => (
                <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Tool: <strong className="text-slate-300">{log.tool}</strong></span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-rose-400">{log.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Admin Security Access Log</h3>
            <p className="text-xs text-slate-400">Recent authenticated dashboard unlocks.</p>
          </div>

          <div className="space-y-2 text-xs">
            {(data?.auditLogs || []).map((audit: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-300 font-semibold">{audit.device}</span>
                <span className="text-slate-500 text-[11px]">{audit.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}