"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || pathname.startsWith("/admin")) return;

    // 1. Increment Total Pageviews
    const currentViews = parseInt(localStorage.getItem("pt_total_views") || "0", 10);
    localStorage.setItem("pt_total_views", (currentViews + 1).toString());

    // 2. Track Unique Visitor Session
    if (!sessionStorage.getItem("pt_session_active")) {
      sessionStorage.setItem("pt_session_active", "true");
      const uniqueVisits = parseInt(localStorage.getItem("pt_unique_visitors") || "0", 10);
      localStorage.setItem("pt_unique_visitors", (uniqueVisits + 1).toString());
    }

    // 3. Track Tool Popularity
    const toolStats = JSON.parse(localStorage.getItem("pt_tool_stats") || "{}");
    const route = pathname === "/" ? "Home" : pathname.replace("/", "");
    toolStats[route] = (toolStats[route] || 0) + 1;
    localStorage.setItem("pt_tool_stats", JSON.stringify(toolStats));

    // 4. Log Visit Timestamp
    const logs = JSON.parse(localStorage.getItem("pt_visit_logs") || "[]");
    logs.push({ path: pathname, time: new Date().toISOString() });
    if (logs.length > 50) logs.shift();
    localStorage.setItem("pt_visit_logs", JSON.stringify(logs));
  }, [pathname]);

  return null;
}