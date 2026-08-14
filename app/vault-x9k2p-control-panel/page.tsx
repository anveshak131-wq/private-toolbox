"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";

export default function SecretAdminPage() {
  // ⚙️ CONFIGURATION: Set your Google Client ID and Authorized Email
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"; // Replace with your Client ID
  const AUTHORIZED_EMAIL = "your-google-email@gmail.com"; // Replace with your exact Google Email

  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);
  const [authError, setAuthError] = useState("");
  const [gsiLoaded, setGsiLoaded] = useState(false);

  // Analytics & Control States
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    toolStats: {} as Record<string, number>,
  });

  const [bannerActive, setBannerActive] = useState(false);
  const [bannerText, setBannerText] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Parse Google JWT Token
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Google Sign-In Callback
  const handleCredentialResponse = (response: any) => {
    const payload = parseJwt(response.credential);

    if (payload && payload.email) {
      if (payload.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
        const userData = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        };
        setUser(userData);
        sessionStorage.setItem("pt_admin_session", JSON.stringify(userData));
        setAuthError("");
        loadDashboardData();
      } else {
        setAuthError(`Access Denied: ${payload.email} is not authorized.`);
      }
    } else {
      setAuthError("Failed to verify Google identity.");
    }
  };

  // Check existing session
  useEffect(() => {
    const saved = sessionStorage.getItem("pt_admin_session");
    if (saved) {
      setUser(JSON.parse(saved));
      loadDashboardData();
    }
  }, []);

  // Initialize Google Sign-In Button
  useEffect(() => {
    if (gsiLoaded && !user && typeof window !== "undefined" && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      const btnContainer = document.getElementById("googleBtn");
      if (btnContainer) {
        (window as any).google.accounts.id.renderButton(btnContainer, {
          theme: "filled_blue",
          size: "large",
          shape: "pill",
          text: "signin_with",
          width: 280,
        });
      }
    }
  }, [gsiLoaded, user]);

  const loadDashboardData = () => {
    const totalViews = parseInt(localStorage.getItem("pt_total_views") || "0", 10);
    const uniqueVisitors = parseInt(localStorage.getItem("pt_unique_visitors") || "0", 10);
    const toolStats = JSON.parse(localStorage.getItem("pt_tool_stats") || "{}");

    setStats({ totalViews, uniqueVisitors, toolStats });
    setBannerActive(localStorage.getItem("pt_setting_banner_active") === "true");
    setBannerText(
      localStorage.getItem("pt_setting_banner_text") ||
        "🔥 100% Free & Private Browser Tools."
    );
  };

  const saveSettings = () => {
    localStorage.setItem("pt_setting_banner_active", bannerActive.toString());
    localStorage.setItem("pt_setting_banner_text", bannerText);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("pt_admin_session");
    setUser(null);
  };

  return (
    <>
      {/* Load Google Identity Services SDK */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGsiLoaded(true)}
      />

      <main className="min-h-screen p-6 md:p-12 text-slate-100 flex flex-col items-center justify-center">
        {!user ? (
          /* 1. Google OAuth Gate */
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>

            <div className="h-14 w-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl mx-auto text-indigo-400">
              🔒
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold text-white">Private Command Center</h1>
              <p className="text-xs text-slate-400">
                Restricted access. Sign in with authorized Google account.
              </p>
            </div>

            <div className="flex justify-center min-h-[44px] pt-2">
              <div id="googleBtn"></div>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                {authError}
              </div>
            )}

            <div className="pt-2">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-400">
                ← Return to Site
              </Link>
            </div>
          </div>
        ) : (
          /* 2. Authorized Admin Dashboard */
          <div className="max-w-5xl w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-4">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border border-indigo-500/40"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-black text-white">
                    Welcome, {user.name}
                  </h1>
                  <p className="text-xs text-emerald-400 font-mono">
                    ✓ Verified Admin ({user.email})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition"
                >
                  View Live Site ↗
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs px-4 py-2 rounded-xl transition font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Total Views</p>
                <p className="text-3xl font-black text-white">{stats.totalViews}</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Unique Visitors</p>
                <p className="text-3xl font-black text-indigo-400">{stats.uniqueVisitors}</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Hosting Cost</p>
                <p className="text-3xl font-black text-emerald-400">₹0 / mo</p>
              </div>
            </div>

            {/* Site Controls */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white text-base">🎛️ Live Site Controls</h2>
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-semibold">
                    ✓ Saved!
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium">Top Announcement Banner</label>
                  <input
                    type="checkbox"
                    checked={bannerActive}
                    onChange={(e) => setBannerActive(e.target.checked)}
                    className="accent-indigo-500 h-4 w-4 cursor-pointer"
                  />
                </div>

                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                />

                <button
                  onClick={saveSettings}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  Save Controls
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}