"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ToolIcon from "./components/ToolIcons";
import SmartHeroDropzone from "./components/SmartHeroDropzone";
import { getSiteConfig } from "./lib/analytics";
import { sounds } from "./lib/soundEffects";

interface ToolDef {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: "images" | "pdf" | "dev" | "privacy" | "text";
  featured?: boolean;
}

const TOOLS: ToolDef[] = [
  // Flagships
  {
    id: "image-compressor",
    title: "Lossless Image Compressor",
    description: "Compress PNG, JPG, and WebP files locally with real-time split inspection.",
    badge: "Flagship",
    category: "images",
    featured: true,
  },
  {
    id: "pdf-organizer",
    title: "PDF Splitter & Organizer",
    description: "Interactive thumbnail grid to rearrange, rotate, split, and delete PDF pages.",
    badge: "Popular",
    category: "pdf",
    featured: true,
  },
  // Privacy Suite
  {
    id: "metadata-stripper",
    title: "EXIF & Metadata Stripper",
    description: "Remove GPS locations, device serials, and timestamps from photos before sharing.",
    badge: "100% Private",
    category: "privacy",
  },
  {
    id: "file-encryptor",
    title: "Client-Side File Encryptor",
    description: "Encrypt and decrypt files using military-grade AES-256-GCM in browser memory.",
    badge: "AES-GCM",
    category: "privacy",
  },
  {
    id: "privacy-redactor",
    title: "Privacy Redactor",
    description: "Black out sensitive phone numbers, faces, and classified areas before sharing.",
    badge: "Sanitizer",
    category: "privacy",
  },
  {
    id: "password-generator",
    title: "Password & Passphrase Generator",
    description: "Generate cryptographically secure passwords with entropy controls.",
    badge: "WebCrypto",
    category: "privacy",
  },
  // Media & Design Suite
  {
    id: "audio-trimmer",
    title: "In-Browser Audio Trimmer",
    description: "Trim voice notes, podcasts, and MP3/WAV tracks with sample-accurate playback.",
    badge: "WebAudio",
    category: "images",
  },
  {
    id: "color-palette",
    title: "Color Palette Extractor",
    description: "Extract dominant hex color swatches directly from any image or brand asset.",
    badge: "Design",
    category: "images",
  },
  {
    id: "favicon-generator",
    title: "Favicon & Icon Generator",
    description: "Generate multi-resolution 16px to 512px icon bundles in a single .zip file.",
    badge: "Multi-size",
    category: "images",
  },
  {
    id: "heic-converter",
    title: "HEIC to JPEG Converter",
    description: "Decode Apple iPhone HEIC/HEIF photos directly into standard JPEG format.",
    badge: "Apple Format",
    category: "images",
  },
  {
    id: "svg-converter",
    title: "SVG to Vector/Raster",
    description: "Rasterize SVG vector illustrations to high-resolution PNG, WebP, or JPEG.",
    badge: "Hi-DPI",
    category: "images",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize dimensions, scale percentages, and convert aspect ratios instantly.",
    badge: "Lossless",
    category: "images",
  },
  // PDF Suite
  {
    id: "pdf-merger",
    title: "PDF Merger",
    description: "Combine multiple PDF documents into a single organized file in seconds.",
    badge: "Zero Upload",
    category: "pdf",
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert batches of JPG, PNG, and WebP images into a single formatted PDF.",
    badge: "Batch",
    category: "pdf",
  },
  // Text & Document Suite
  {
    id: "markdown-preview",
    title: "Markdown Live Previewer",
    description: "Write and preview formatted Markdown and export compiled HTML code.",
    badge: "Split-view",
    category: "text",
  },
  {
    id: "word-counter",
    title: "Word & Read-Time Counter",
    description: "Compute word count, speaking duration, and character metrics in real-time.",
    badge: "Analytics",
    category: "text",
  },
  {
    id: "case-converter",
    title: "Text Case Converter",
    description: "Switch text between camelCase, kebab-case, snake_case, and Title Case.",
    badge: "Developer",
    category: "text",
  },
  // Developer
  {
    id: "json-formatter",
    title: "JSON Formatter & Validator",
    description: "Prettify, minify, validate, and convert JSON structures with syntax highlighting.",
    badge: "Dev Tool",
    category: "dev",
  },
  {
    id: "diff-checker",
    title: "Text Diff Checker",
    description: "Compare two text snippets side-by-side to highlight added and removed lines.",
    badge: "Line Diff",
    category: "dev",
  },
  {
    id: "base64-codec",
    title: "Base64 Encoder & Decoder",
    description: "Encode text and files into Base64 or decode Base64 data URIs instantly.",
    badge: "Dual-mode",
    category: "dev",
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description: "Generate high-resolution vector and PNG QR codes with zero tracking.",
    badge: "Customizable",
    category: "dev",
  },
];

const WORKFLOW_PRESETS = [
  { label: "📦 Email Prep", tools: ["image-compressor", "pdf-merger", "image-to-pdf"] },
  { label: "🛡️ Privacy Cleanse", tools: ["metadata-stripper", "file-encryptor", "privacy-redactor"] },
  { label: "🎨 Designer Pack", tools: ["color-palette", "favicon-generator", "svg-converter"] },
  { label: "📝 Writer Toolkit", tools: ["markdown-preview", "word-counter", "case-converter"] },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"bento" | "table">("bento");
  const [activePreset, setActivePreset] = useState<string | null>(null);
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
    if (activePreset) {
      const preset = WORKFLOW_PRESETS.find((p) => p.label === activePreset);
      return preset?.tools.includes(t.id);
    }
    if (activeCategory === "all") return true;
    return t.category === activeCategory;
  });

  const recentTools = TOOLS.filter((t) => recentToolIds.includes(t.id));

  const handleToolClick = (id: string) => {
    sounds.playPop();
    try {
      const recents = JSON.parse(localStorage.getItem("pt_recent_tools") || "[]");
      const updated = [id, ...recents.filter((item: string) => item !== id)].slice(0, 5);
      localStorage.setItem("pt_recent_tools", JSON.stringify(updated));
    } catch {}
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Local In-Browser Memory • Zero Uploads</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          Private, Client-Side <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            File, Media & Text Tools
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Perform conversions, encryption, EXIF scrubbing, and audio trimming directly in your browser memory.
        </p>
      </section>

      {/* Smart File Dropzone */}
      <SmartHeroDropzone />

      {/* Scenario Presets */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
          Scenario Presets:
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {WORKFLOW_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                sounds.playPop();
                setActivePreset(activePreset === preset.label ? null : preset.label);
                setActiveCategory("all");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                activePreset === preset.label
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Used Bar */}
      {recentTools.length > 0 && !activePreset && (
        <section className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>⚡ Recently Used</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentTools.slice(0, 4).map((tool) => (
              <Link
                key={tool.id}
                href={`/${tool.id}`}
                onClick={() => handleToolClick(tool.id)}
                className="flex items-center gap-3 p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-2xl transition hover:scale-[1.02]"
              >
                <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <ToolIcon name={tool.id} className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{tool.title}</div>
                  <div className="text-[10px] text-slate-400">Reopen tool →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Directory Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Utilities" },
              { id: "privacy", label: "🛡️ Privacy" },
              { id: "images", label: "🖼️ Media & Audio" },
              { id: "pdf", label: "📑 PDFs" },
              { id: "text", label: "📝 Text & Docs" },
              { id: "dev", label: "💻 Developer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveCategory(tab.id);
                  setActivePreset(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeCategory === tab.id && !activePreset
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                sounds.playPop();
                setViewMode("bento");
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === "bento" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Bento Grid
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setViewMode("table");
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === "table" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Dense List
            </button>
          </div>
        </div>

        {viewMode === "bento" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => {
              const isDisabled = disabledTools.includes(tool.id);
              const isFlagship = tool.featured && !activePreset && activeCategory === "all";

              return (
                <Link
                  key={tool.id}
                  href={isDisabled ? "#" : `/${tool.id}`}
                  onClick={() => !isDisabled && handleToolClick(tool.id)}
                  className={`group relative flex flex-col justify-between p-6 rounded-3xl border transition duration-200 ${
                    isFlagship
                      ? "sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/30 border-indigo-500/40 hover:border-indigo-500"
                      : "bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-indigo-500/50"
                  } ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl group-hover:scale-110 group-hover:border-indigo-500/40 transition duration-200 shadow-inner">
                        <ToolIcon name={tool.id} className={isFlagship ? "w-8 h-8" : "w-6 h-6"} />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300 font-mono">
                        {isDisabled ? "Maintenance" : tool.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-white group-hover:text-indigo-400 transition ${isFlagship ? "text-lg" : "text-base"}`}>
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between text-xs font-semibold text-indigo-400">
                    <span className="group-hover:translate-x-1 transition duration-200">
                      {isDisabled ? "Temporarily Disabled" : "Open Tool →"}
                    </span>
                    <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      /{tool.id}
                    </kbd>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/${tool.id}`}
                onClick={() => handleToolClick(tool.id)}
                className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <ToolIcon name={tool.id} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition">
                      {tool.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-md">{tool.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{tool.category}</span>
                  <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}