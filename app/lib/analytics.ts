export interface ToolUsageStat {
    [toolName: string]: number;
  }
  
  export interface ErrorLogItem {
    id: string;
    timestamp: string;
    tool: string;
    message: string;
  }
  
  export interface FeedbackItem {
    id: string;
    timestamp: string;
    type: "feature" | "bug" | "feedback";
    tool?: string;
    message: string;
    contact?: string;
    status: "new" | "reviewed" | "archived";
  }
  
  export interface AdminAuditLog {
    timestamp: string;
    device: string;
    ipPlaceholder: string;
  }
  
  export interface WebhookConfig {
    enabled: boolean;
    type: "discord" | "telegram";
    discordWebhookUrl: string;
    telegramBotToken: string;
    telegramChatId: string;
    notifyOnSupport: boolean;
    notifyOnError: boolean;
    notifyOnFeedback: boolean;
  }
  
  export interface SiteConfig {
    announcement: {
      enabled: boolean;
      message: string;
      type: "info" | "warning" | "success";
    };
    disabledTools: string[];
    webhooks: WebhookConfig;
  }
  
  const STORAGE_KEYS = {
    PAGE_VIEWS: "pt_analytics_page_views",
    TOOL_VIEWS: "pt_analytics_tool_views",
    SUPPORT_CLICKS: "pt_analytics_support_clicks",
    DEVICE_STATS: "pt_analytics_device_stats",
    ERROR_LOGS: "pt_analytics_error_logs",
    FEEDBACK_ITEMS: "pt_analytics_feedback_items",
    SITE_CONFIG: "pt_site_config",
    AUDIT_LOGS: "pt_admin_audit_logs",
  };
  
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
  
  // Dispatch Discord or Telegram Webhooks
  export const sendWebhookNotification = async (title: string, message: string, color: number = 0x6366f1) => {
    const config = getSiteConfig();
    const { webhooks } = config;
  
    if (!webhooks.enabled) return;
  
    try {
      if (webhooks.type === "discord" && webhooks.discordWebhookUrl) {
        await fetch(webhooks.discordWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title,
                description: message,
                color,
                footer: { text: "PrivateToolbox System Alert" },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } else if (webhooks.type === "telegram" && webhooks.telegramBotToken && webhooks.telegramChatId) {
        const text = `*${title}*\n\n${message}`;
        const url = `https://api.telegram.org/bot${webhooks.telegramBotToken}/sendMessage`;
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: webhooks.telegramChatId,
            text,
            parse_mode: "Markdown",
          }),
        });
      }
    } catch (err) {
      console.warn("Webhook dispatch failed:", err);
    }
  };
  
  export const trackView = (path: string) => {
    if (typeof window === "undefined" || path.includes("vault")) return;
  
    const total = getStorage<number>(STORAGE_KEYS.PAGE_VIEWS, 0);
    setStorage(STORAGE_KEYS.PAGE_VIEWS, total + 1);
  
    const toolViews = getStorage<ToolUsageStat>(STORAGE_KEYS.TOOL_VIEWS, {});
    const cleanPath = path.replace("/", "") || "homepage";
    toolViews[cleanPath] = (toolViews[cleanPath] || 0) + 1;
    setStorage(STORAGE_KEYS.TOOL_VIEWS, toolViews);
  
    const device = window.innerWidth < 768 ? "Mobile" : window.innerWidth < 1024 ? "Tablet" : "Desktop";
    const deviceStats = getStorage<{ [key: string]: number }>(STORAGE_KEYS.DEVICE_STATS, {
      Desktop: 0,
      Mobile: 0,
      Tablet: 0,
    });
    deviceStats[device] = (deviceStats[device] || 0) + 1;
    setStorage(STORAGE_KEYS.DEVICE_STATS, deviceStats);
  };
  
  export const trackSupportClick = () => {
    const current = getStorage<number>(STORAGE_KEYS.SUPPORT_CLICKS, 0);
    setStorage(STORAGE_KEYS.SUPPORT_CLICKS, current + 1);
  
    const config = getSiteConfig();
    if (config.webhooks.notifyOnSupport) {
      sendWebhookNotification(
        "☕ Support Conversion Detected!",
        "A visitor just clicked the Razorpay support/donation link.",
        0x10b981
      );
    }
  };
  
  export const logError = (tool: string, message: string) => {
    const logs = getStorage<ErrorLogItem[]>(STORAGE_KEYS.ERROR_LOGS, []);
    const newLog: ErrorLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString(),
      tool,
      message,
    };
    setStorage(STORAGE_KEYS.ERROR_LOGS, [newLog, ...logs].slice(0, 50));
  
    const config = getSiteConfig();
    if (config.webhooks.notifyOnError) {
      sendWebhookNotification(
        `🚨 Client Error in /${tool}`,
        `Error details: \`${message}\``,
        0xef4444
      );
    }
  };
  
  // Feedback Management
  export const submitUserFeedback = async (
    type: "feature" | "bug" | "feedback",
    message: string,
    tool?: string,
    contact?: string
  ) => {
    const items = getStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK_ITEMS, []);
    const newItem: FeedbackItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString(),
      type,
      tool,
      message,
      contact,
      status: "new",
    };
    setStorage(STORAGE_KEYS.FEEDBACK_ITEMS, [newItem, ...items].slice(0, 100));
  
    const config = getSiteConfig();
    if (config.webhooks.notifyOnFeedback) {
      sendWebhookNotification(
        `📩 New User Submission: ${type.toUpperCase()}`,
        `**Tool:** ${tool || "General"}\n**Message:** ${message}\n**Contact:** ${contact || "Anonymous"}`,
        0x3b82f6
      );
    }
  };
  
  export const updateFeedbackStatus = (id: string, status: "new" | "reviewed" | "archived") => {
    const items = getStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK_ITEMS, []);
    const updated = items.map((item) => (item.id === id ? { ...item, status } : item));
    setStorage(STORAGE_KEYS.FEEDBACK_ITEMS, updated);
  };
  
  export const deleteFeedbackItem = (id: string) => {
    const items = getStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK_ITEMS, []);
    setStorage(
      STORAGE_KEYS.FEEDBACK_ITEMS,
      items.filter((item) => item.id !== id)
    );
  };
  
  export const getSiteConfig = (): SiteConfig => {
    return getStorage<SiteConfig>(STORAGE_KEYS.SITE_CONFIG, {
      announcement: {
        enabled: false,
        message: "⚡ All operations execute locally in your browser memory.",
        type: "info",
      },
      disabledTools: [],
      webhooks: {
        enabled: false,
        type: "discord",
        discordWebhookUrl: "",
        telegramBotToken: "",
        telegramChatId: "",
        notifyOnSupport: true,
        notifyOnError: true,
        notifyOnFeedback: true,
      },
    });
  };
  
  export const updateSiteConfig = (newConfig: SiteConfig) => {
    setStorage(STORAGE_KEYS.SITE_CONFIG, newConfig);
  };
  
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
      feedbackItems: getStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK_ITEMS, []),
      auditLogs: getStorage<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []),
    };
  };
  
  export const logAdminLogin = () => {
    const audits = getStorage<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newEntry: AdminAuditLog = {
      timestamp: new Date().toLocaleString(),
      device: navigator.userAgent.includes("Mobile") ? "Mobile Device" : "Desktop Browser",
      ipPlaceholder: "Client Session",
    };
    setStorage(STORAGE_KEYS.AUDIT_LOGS, [newEntry, ...audits].slice(0, 20));
  };
  
  export const resetAnalyticsData = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.PAGE_VIEWS);
    localStorage.removeItem(STORAGE_KEYS.TOOL_VIEWS);
    localStorage.removeItem(STORAGE_KEYS.SUPPORT_CLICKS);
    localStorage.removeItem(STORAGE_KEYS.DEVICE_STATS);
    localStorage.removeItem(STORAGE_KEYS.ERROR_LOGS);
  };