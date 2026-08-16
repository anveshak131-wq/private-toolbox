"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  getAnalyticsData,
  getSiteConfig,
  updateSiteConfig,
  resetAnalyticsData,
  logAdminLogin,
  SiteConfig,
} from "../lib/analytics";

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
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"metrics" | "tools" | "announcement" | "errors" | "audit">("metrics");
  const [data, setData] = useState<any>(null);
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig());

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  const handleLoginSuccess = (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      if (AUTHORIZED_ADMIN_EMAILS.includes(email)) {
        setAdminUser({ email, name: decoded.name || email });
        setAuthError(null);
        logAdminLogin();
        setData(getAnalyticsData());
        setConfig(getSiteConfig());
      } else {
        setAuthError(`Access denied: ${email} is not in the authorized admins whitelist.`);
      }
    } catch {
      setAuthError("Failed to decode Google authentication token.");
    }
  };

  const handleSignOut = () => {
    setAdminUser(null);
    setAuthError(null);
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

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {!adminUser ? (
        <main className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl max-w-sm w-full space-y-6 text-center shadow-2xl backdrop-blur-xl">
            <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              🛡️
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Master Control Vault</h1>
              <p className="text-xs text-slate-400 mt-1">Sign in with your Google Account</p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
                {authError}
              </div>
            )}

            <div className="flex justify-center pt-2">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => setAuthError("Google Sign-In failed.")}
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Authenticated: {adminUser.email}
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

          {/* Navigation Tabs */}
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

          {/* TAB 1: METRICS */}
          {activeTab === "metrics" && data && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400 font-semibold">Total Page Impressions</div>
                  <div className="text-3xl font-black text-white mt-1">{data.totalViews}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400 font-semibold">Support Link Clicks</div>
                  <div className="text-3xl font-black text-indigo-400 mt-1">{data.supportClicks || 0}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400 font-semibold">Support Conversion Rate</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">
                    {data.totalViews ? (((data.supportClicks || 0) / data.totalViews) * 100).toFixed(2) : "0.00"}%
                  </div>
                </div>
              </div>

              {/* Tool Breakdown */}
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

              <div className="pt-4 flex justify-end">
                <button onClick={handleResetData} className="text-xs text-rose-400 hover:underline">
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
                <p className="text-xs text-slate-400">Broadcast maintenance alerts or updates across all pages.</p>
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
      )}
    </GoogleOAuthProvider>
  );
}