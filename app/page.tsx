"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSiteConfig } from "./lib/analytics";

interface ToolDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  category: "all" | "images" | "pdf" | "dev" | "privacy";
}

const TOOLS: ToolDef[] = [
  {
    id: "image-compressor",
    title: "Image Compressor",
    description: "Compress PNG, JPG, and WebP files locally with instant side-by-side comparison.",
    icon: "🗜️",
    badge: "Fast Canvas",
    category: "images",
  },
  {
    id: "pdf-merger",
    title: "PDF Merger",
    description: "Combine multiple PDF documents into a single organized file in seconds.",
    icon: "📑",
    badge: "Zero Upload",
    category: "pdf",
  },
  {
    id: "pdf-organizer",
    title: "PDF Splitter & Organizer",
    description: "Rearrange, split, delete, or rotate pages directly in your browser.",
    icon: "✂️",
    badge: "Interactive",
    category: "pdf",
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert batches of JPG, PNG, and WebP images into a single formatted PDF.",
    icon: "📄",
    badge: "Multi-file",
    category: "pdf",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize dimensions, scale percentages, and convert aspect ratios instantly.",
    icon: "📐",
    badge: "Lossless",
    category: "images",
  },
  {
    id: "privacy-redactor",
    title: "Privacy Redactor",
    description: "Censor confidential numbers, faces, and sensitive areas on documents.",
    icon: "🛡️",
    badge: "100% Private",
    category: "privacy",
  },
  {
    id: "json-formatter",
    title: "JSON Formatter & Validator",
    description: "Prettify, minify, validate, and convert JSON structures with syntax highlighting.",
    icon: "✨",
    badge: "Dev Tool",
    category: "dev",
  },
  {
    id: "diff-checker",
    title: "Text Diff Checker",
    description: "Compare two text snippets side-by-side to highlight added and removed lines.",
    icon: "🔍",
    badge: "Line Diff",
    category: "dev",
  },
  {
    id: "base64-codec",
    title: "Base64 Encoder & Decoder",
    description: "Encode text and files into Base64 or decode Base64 data URIs instantly.",
    icon: "⚡",
    badge: "Dual-mode",
    category: "dev",
  },
  {
    id: "svg-converter",
    title: "SVG to Vector/Raster",
    description: "Rasterize SVG vector illustrations to high-resolution PNG, WebP, or JPEG.",
    icon: "🎨",
    badge: "Hi-DPI",
    category: "images",
  },
  {
    id: "heic-converter",
    title: "HEIC to JPEG Converter",
    description: "Decode Apple iPhone HEIC/HEIF photos directly into standard JPEG format.",
    icon: "📷",
    badge: "Apple Format",
    category: "images",
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description: "Generate high-resolution vector and PNG QR codes with zero tracking.",
    icon: "🏁",
    badge: "Customizable",
    category: "dev",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"all" | "images" | "pdf" | "dev" | "privacy">("all");
  const [recentToolIds, setRecentToolIds] = useState<string[]>([]);
  const [disabledTools, setDisabledTools] = useState<string[]>([]);

  useEffect(() => {
    try {
      const recents = JSON.parse(localStorage.getItem("pt_recent_tools") || "[]");
      setRecentToolIds(recents);
      const config = getSiteConfig();
      setDisabledTools(config.disabledTools || []);
    } catch {}
  }, []);

  const filteredTools = TOOLS.filter((t) => {
    if (activeTab === "all") return true;
    return t.category === activeTab;
  });

  const recentTools = TOOLS.filter((t) => recentToolIds.includes(t.id));

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <span>🔒</span>
          <span>Zero Server Uploads • Zero Telemetry</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          Private, In-Browser <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Developer & File Tools
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Perform file conversions, compression, editing, and formatting entirely inside your browser memory.
        </p>
      </section>

      {/* Recently Used Tools Bar */}
      {recentTools.length > 0 && (
        <section className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>⚡ Recently Used</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentTools.slice(0, 4).map((tool) => (
              <Link
                key={tool.id}
                href={`/${tool.id}`}
                className="flex items-center gap-3 p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-2xl transition hover:scale-[1.02]"
              >
                <span className="text-xl">{tool.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{tool.title}</div>
                  <div className="text-[10px] text-slate-400">Jump back in</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Tabs */}
      <section className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-center border-b border-slate-800/80 pb-4">
          {[
            { id: "all", label: "All Utilities" },
            { id: "images", label: "🖼️ Image Tools" },
            { id: "pdf", label: "📑 PDF Tools" },
            { id: "dev", label: "💻 Developer" },
            { id: "privacy", label: "🛡️ Privacy" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const isDisabled = disabledTools.includes(tool.id);
            return (
              <Link
                key={tool.id}
                href={isDisabled ? "#" : `/${tool.id}`}
                onClick={() => {
                  if (isDisabled) return;
                  try {
                    const recents = JSON.parse(localStorage.getItem("pt_recent_tools") || "[]");
                    const updated = [tool.id, ...recents.filter((item: string) => item !== tool.id)].slice(0, 5);
                    localStorage.setItem("pt_recent_tools", JSON.stringify(updated));
                  } catch {}
                }}
                className={`group relative flex flex-col justify-between p-6 rounded-3xl border transition duration-200 ${
                  isDisabled
                    ? "bg-slate-950/40 border-slate-800/40 opacity-50 cursor-not-allowed"
                    : "bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl group-hover:scale-110 transition duration-200">
                      {tool.icon}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300">
                      {isDisabled ? "Maintenance" : tool.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition duration-200">
                  <span>{isDisabled ? "Currently Unavailable" : "Open Utility →"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}