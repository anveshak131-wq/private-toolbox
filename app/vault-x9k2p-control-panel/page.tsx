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
  updateFeedbackStatus,
  deleteFeedbackItem,
  sendWebhookNotification,
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
  const [activeTab, setActiveTab] = useState<"metrics" | "inbox" | "webhooks" | "tools" | "announcement" | "errors">("metrics");
  const [data, setData] = useState<any>(null);
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig());
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  const handleLoginSuccess = (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      if (AUTHORIZED_ADMIN_EMAILS.includes(email)) {
        setAdminUser({ email, name: decoded.name || email });
        setAuthError(null);
        logAdminLogin();
        refreshData();
      } else {
        setAuthError(`Access denied: ${email} is not in the authorized admins whitelist.`);
      }
    } catch {
      setAuthError("Failed to decode Google authentication token.");
    }
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

  const handleSaveWebhooks = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(config);
    alert("Webhook alert settings saved successfully!");
  };

  const handleTestWebhook = async () => {
    setTestWebhookStatus("Sending test alert...");
    await sendWebhookNotification(
      "🔔 Test Notification",
      "Your real-time Discord / Telegram alert connection is working perfectly!",
      0x6366f1
    );
    setTestWebhookStatus("✓ Test alert sent!");
    setTimeout(() => setTestWebhookStatus(null), 3000);
  };

  const handleFeedbackStatusChange = (id: string, status: "new" | "reviewed" | "archived") => {
    updateFeedbackStatus(id, status);
    refreshData();
  };

  const handleDeleteFeedback = (id: string) => {
    if (confirm("Delete this feedback entry?")) {
      deleteFeedbackItem(id);
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
              <p className="text-xs text-slate-400">Manage real-time alerts, user request inbox, and tool controls.</p>
            </div>
            <button
              onClick={() => setAdminUser(null)}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition"
            >
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
            {[
              { id: "metrics", label: "📊 Usage & Metrics" },
              { id: "inbox", label: `📥 Inbox (${data?.feedbackItems?.filter((f: any) => f.status === "new").length || 0})` },
              { id: "webhooks", label: "🔔 Webhook Alerts" },
              { id: "tools", label: "⚙️ Tool Killswitches" },
              { id: "announcement", label: "📢 Announcement" },
              { id: "errors", label: "🚨 Caught Errors" },
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
                  <div className="text-xs text-slate-400 font-semibold">Total Page Views</div>
                  <div className="text-3xl font-black text-white mt-1">{data.totalViews}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400 font-semibold">Support Conversions</div>
                  <div className="text-3xl font-black text-indigo-400 mt-1">{data.supportClicks || 0}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400 font-semibold">Conversion Rate</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">
                    {data.totalViews ? (((data.supportClicks || 0) / data.totalViews) * 100).toFixed(2) : "0.00"}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INBOX */}
          {activeTab === "inbox" && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white">User Feedback & Feature Requests</h3>
                  <p className="text-xs text-slate-400">Incoming requests from the footer & modal widget.</p>
                </div>
              </div>

              {(!data?.feedbackItems || data.feedbackItems.length === 0) ? (
                <div className="py-8 text-center text-xs text-slate-500">Inbox is empty. No user feedback yet.</div>
              ) : (
                <div className="space-y-3">
                  {data.feedbackItems.map((item: any) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition space-y-2 ${
                        item.status === "new"
                          ? "bg-slate-950 border-indigo-500/40"
                          : item.status === "reviewed"
                          ? "bg-slate-950/60 border-slate-800"
                          : "bg-slate-950/30 border-slate-900 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.type === "feature"
                                ? "bg-indigo-500/20 text-indigo-300"
                                : item.type === "bug"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="text-xs text-slate-400">{item.timestamp}</span>
                          {item.tool && <span className="text-xs text-slate-500">via {item.tool}</span>}
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e: any) => handleFeedbackStatusChange(item.id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-2 py-1"
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-sans">{item.message}</p>

                      {item.contact && (
                        <div className="text-[11px] text-slate-400">
                          Contact: <span className="text-slate-200 font-mono">{item.contact}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WEBHOOK ALERTS */}
          {activeTab === "webhooks" && (
            <form onSubmit={handleSaveWebhooks} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Real-Time Discord & Telegram Alerts</h3>
                <p className="text-xs text-slate-400">Receive instant push notifications for donations, crashes, and requests.</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="webhookEnabled"
                  checked={config.webhooks?.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      webhooks: { ...config.webhooks, enabled: e.target.checked },
                    })
                  }
                  className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="webhookEnabled" className="text-xs font-semibold text-white">
                  Enable Real-Time Webhook Notifications
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Platform</label>
                  <select
                    value={config.webhooks?.type}
                    onChange={(e: any) =>
                      setConfig({
                        ...config,
                        webhooks: { ...config.webhooks, type: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="discord">Discord Channel Webhook</option>
                    <option value="telegram">Telegram Bot</option>
                  </select>
                </div>
              </div>

              {config.webhooks?.type === "discord" ? (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Discord Webhook URL</label>
                  <input
                    type="url"
                    value={config.webhooks?.discordWebhookUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        webhooks: { ...config.webhooks, discordWebhookUrl: e.target.value },
                      })
                    }
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Telegram Bot Token</label>
                    <input
                      type="text"
                      value={config.webhooks?.telegramBotToken}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          webhooks: { ...config.webhooks, telegramBotToken: e.target.value },
                        })
                      }
                      placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Telegram Chat ID</label>
                    <input
                      type="text"
                      value={config.webhooks?.telegramChatId}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          webhooks: { ...config.webhooks, telegramChatId: e.target.value },
                        })
                      }
                      placeholder="e.g., 987654321"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-300 mb-2">Notification Triggers:</div>
                {[
                  { key: "notifyOnSupport", label: "☕ Support Conversion (Visitor clicks Razorpay link)" },
                  { key: "notifyOnError", label: "🚨 Tool Runtime Errors & Crashes" },
                  { key: "notifyOnFeedback", label: "📩 User Requests & Feedback Submissions" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={(config.webhooks as any)?.[key]}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          webhooks: { ...config.webhooks, [key]: e.target.checked },
                        })
                      }
                      className="h-3.5 w-3.5 rounded bg-slate-950 border-slate-700 text-indigo-600"
                    />
                    <label htmlFor={key} className="text-xs text-slate-400">
                      {label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition"
                >
                  Save Webhook Settings
                </button>
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition"
                >
                  Send Test Alert
                </button>
                {testWebhookStatus && <span className="text-xs text-emerald-400 font-semibold">{testWebhookStatus}</span>}
              </div>
            </form>
          )}

          {/* TAB 4: TOOL KILLSWITCHES */}
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

          {/* TAB 5: ANNOUNCEMENT */}
          {activeTab === "announcement" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSiteConfig(config);
                alert("Announcement updated!");
              }}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4"
            >
              <div>
                <h3 className="text-sm font-bold text-white">Site-wide Notification Banner</h3>
                <p className="text-xs text-slate-400">Broadcast maintenance alerts or update messages.</p>
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

          {/* TAB 6: CAUGHT ERRORS */}
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
        </main>
      )}
    </GoogleOAuthProvider>
  );
}