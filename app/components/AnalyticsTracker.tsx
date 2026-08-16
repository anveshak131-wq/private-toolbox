"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackView, getSiteConfig, SiteConfig } from "../lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    trackView(pathname);
    setConfig(getSiteConfig());
  }, [pathname]);

  if (!config?.announcement?.enabled || !config?.announcement?.message) {
    return null;
  }

  const bgStyles =
    {
      info: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300",
      warning: "bg-amber-500/10 border-amber-500/20 text-amber-300",
      success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    }[config.announcement.type] ||
    "bg-indigo-500/10 border-indigo-500/20 text-indigo-300";

  return (
    <aside
      aria-label="System Announcement"
      className={`w-full border-b py-2 px-4 text-center text-xs font-medium backdrop-blur-md ${bgStyles}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <span>{config.announcement.message}</span>
      </div>
    </aside>
  );
}