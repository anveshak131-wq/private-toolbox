export interface ToolUsageStat {
    [toolName: string]: number;
  }
  
  export interface ErrorLogItem {
    id: string;
    timestamp: string;
    tool: string;
    message: string;
  }
  
  export interface AdminAuditLog {
    timestamp: string;
    device: string;
    ipPlaceholder: string;
  }
  
  export interface SiteConfig {
    announcement: {
      enabled: boolean;
      message: string;
      type: "info" | "warning" | "success";
    };
    disabledTools: string[];
  }
  
  const STORAGE_KEYS = {
    PAGE_VIEWS: "pt_analytics_page_views",
    TOOL_VIEWS: "pt_analytics_tool_views",
    SUPPORT_CLICKS: "pt_analytics_support_clicks",
    DEVICE_STATS: "pt_analytics_device_stats",
    ERROR_LOGS: "pt_analytics_error_logs",
    SITE_CONFIG: "pt_site_config",
    AUDIT_LOGS: "pt_admin_audit_logs",
    ADMIN_AUTH: "pt_admin_session",
  };
  
  // Safe localStorage access
  const getStorage = <T>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };
  
  const setStorage = <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage error:", e);
    }
  };
  
  // Track Page & Tool Views
  export const trackView = (path: string) => {
    if (typeof window === "undefined" || path.includes("vault")) return;
  
    const total = getStorage<number>(STORAGE_KEYS.PAGE_VIEWS, 0);
    setStorage(STORAGE_KEYS.PAGE_VIEWS, total + 1);
  
    // Track specific tool
    const toolViews = getStorage<ToolUsageStat>(STORAGE_KEYS.TOOL_VIEWS, {});
    const cleanPath = path.replace("/", "") || "homepage";
    toolViews[cleanPath] = (toolViews[cleanPath] || 0) + 1;
    setStorage(STORAGE_KEYS.TOOL_VIEWS, toolViews);
  
    // Track Device Type
    const device = window.innerWidth < 768 ? "Mobile" : window.innerWidth < 1024 ? "Tablet" : "Desktop";
    const deviceStats = getStorage<{ [key: string]: number }>(STORAGE_KEYS.DEVICE_STATS, {
      Desktop: 0,
      Mobile: 0,
      Tablet: 0,
    });
    deviceStats[device] = (deviceStats[device] || 0) + 1;
    setStorage(STORAGE_KEYS.DEVICE_STATS, deviceStats);
  };
  
  // Track Support Conversions
  export const trackSupportClick = () => {
    const current = getStorage<number>(STORAGE_KEYS.SUPPORT_CLICKS, 0);
    setStorage(STORAGE_KEYS.SUPPORT_CLICKS, current + 1);
  };
  
  // Log Client Errors
  export const logError = (tool: string, message: string) => {
    const logs = getStorage<ErrorLogItem[]>(STORAGE_KEYS.ERROR_LOGS, []);
    const newLog: ErrorLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString(),
      tool,
      message,
    };
    setStorage(STORAGE_KEYS.ERROR_LOGS, [newLog, ...logs].slice(0, 50));
  };
  
  // Config & Tool Flags
  export const getSiteConfig = (): SiteConfig => {
    return getStorage<SiteConfig>(STORAGE_KEYS.SITE_CONFIG, {
      announcement: {
        enabled: false,
        message: "⚡ All processing happens 100% locally in your browser memory.",
        type: "info",
      },
      disabledTools: [],
    });
  };
  
  export const updateSiteConfig = (newConfig: SiteConfig) => {
    setStorage(STORAGE_KEYS.SITE_CONFIG, newConfig);
  };
  
  // Get Full Analytics Data
  export const getAnalyticsData = () => {
    return {
      totalViews: getStorage<number>(STORAGE_KEYS.PAGE_VIEWS, 0),
      supportClicks: getStorage<number>(STORAGE_KEYS.SUPPORT_CLICKS, 0),
      toolViews: getStorage<ToolUsageStat>(STORAGE_KEYS.TOOL_VIEWS, {}),
      deviceStats: getStorage<{ [key: string]: number }>(STORAGE_KEYS.DEVICE_STATS, {
        Desktop: 0,
        Mobile: 0,
        Tablet: 0,
      }),
      errorLogs: getStorage<ErrorLogItem[]>(STORAGE_KEYS.ERROR_LOGS, []),
      auditLogs: getStorage<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []),
    };
  };
  
  // Audit Log for Admin Login
  export const logAdminLogin = () => {
    const audits = getStorage<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newEntry: AdminAuditLog = {
      timestamp: new Date().toLocaleString(),
      device: navigator.userAgent.includes("Mobile") ? "Mobile Device" : "Desktop Browser",
      ipPlaceholder: "Client Session",
    };
    setStorage(STORAGE_KEYS.AUDIT_LOGS, [newEntry, ...audits].slice(0, 20));
  };
  
  // Purge / Reset
  export const resetAnalyticsData = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.PAGE_VIEWS);
    localStorage.removeItem(STORAGE_KEYS.TOOL_VIEWS);
    localStorage.removeItem(STORAGE_KEYS.SUPPORT_CLICKS);
    localStorage.removeItem(STORAGE_KEYS.DEVICE_STATS);
    localStorage.removeItem(STORAGE_KEYS.ERROR_LOGS);
  };