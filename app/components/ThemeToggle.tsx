"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { sounds } from "../lib/soundEffects";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 animate-pulse" />;
  }

  const cycleTheme = () => {
    sounds?.playPop?.();
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <button
      onClick={cycleTheme}
      title={`Current theme: ${theme}. Click to switch.`}
      className="relative p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-sm backdrop-blur-md transition-all active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200 rotate-0" />}
      {theme === "dark" && <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-200 rotate-0" />}
      {theme === "system" && <Monitor className="w-4 h-4 text-emerald-500 transition-transform duration-200" />}
    </button>
  );
}