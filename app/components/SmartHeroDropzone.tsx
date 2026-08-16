"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { sounds } from "../lib/soundEffects";

interface FileSuggestion {
  title: string;
  route: string;
  desc: string;
  badge: string;
}

export default function SmartHeroDropzone() {
  const [dragActive, setDragActive] = useState(false);
  const [detectedFile, setDetectedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [suggestions, setSuggestions] = useState<FileSuggestion[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const analyzeFile = (file: File) => {
    sounds.playPop();
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const sizeStr = (file.size / 1024).toFixed(1) + " KB";
    setDetectedFile({ name: file.name, size: sizeStr, type: file.type || ext });

    if (file.type.includes("pdf") || ext === "pdf") {
      setSuggestions([
        { title: "Split & Reorganize", route: "/pdf-organizer", desc: "Delete pages or split into parts", badge: "PDF" },
        { title: "Merge with Another PDF", route: "/pdf-merger", desc: "Combine multiple PDF files", badge: "PDF" },
      ]);
    } else if (ext === "heic" || ext === "heif") {
      setSuggestions([
        { title: "Convert HEIC to JPEG", route: "/heic-converter", desc: "Decode Apple format to JPG", badge: "Converter" },
        { title: "Compress Photo", route: "/image-compressor", desc: "Reduce file size", badge: "Compress" },
      ]);
    } else if (file.type.startsWith("image/") || ext === "svg" || ext === "png" || ext === "jpg" || ext === "webp") {
      setSuggestions([
        { title: "Lossless Compressor", route: "/image-compressor", desc: "Reduce size with live compare", badge: "Popular" },
        { title: "Batch Resizer", route: "/image-resizer", desc: "Adjust dimensions and aspect ratio", badge: "Resize" },
        { title: "Convert to PDF", route: "/image-to-pdf", desc: "Package image into standard PDF", badge: "PDF" },
        { title: "Redact Sensitive Info", route: "/privacy-redactor", desc: "Black out numbers and faces", badge: "Privacy" },
      ]);
    } else if (ext === "json" || file.type.includes("json")) {
      setSuggestions([
        { title: "Format & Validate JSON", route: "/json-formatter", desc: "Prettify or minify code", badge: "Developer" },
        { title: "Text Diff Checker", route: "/diff-checker", desc: "Compare against another text", badge: "Developer" },
      ]);
    } else {
      setSuggestions([
        { title: "Encode / Decode Base64", route: "/base64-codec", desc: "Convert to base64 string", badge: "Codec" },
        { title: "Text Diff Checker", route: "/diff-checker", desc: "Compare changes", badge: "Diff" },
      ]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      analyzeFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !detectedFile && inputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed transition-all duration-200 p-6 sm:p-8 text-center cursor-pointer ${
          dragActive
            ? "border-indigo-400 bg-indigo-950/40 shadow-2xl shadow-indigo-500/20 scale-[1.01]"
            : detectedFile
            ? "border-emerald-500/40 bg-slate-900/90 shadow-xl"
            : "border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && analyzeFile(e.target.files[0])}
        />

        {!detectedFile ? (
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-xl shadow-inner">
              ⚡
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Drop any file here to launch the right tool instantly
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Auto-detects Images, PDFs, HEIC, JSON, SVG, and text in your browser memory
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Cmd + V</kbd>
              <span>to paste screenshot</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">{detectedFile.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{detectedFile.size} • Ready for processing</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetectedFile(null);
                  setSuggestions([]);
                }}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Suggested Operations:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playPop();
                      router.push(s.route);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 text-left transition group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-white">{s.title}</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-indigo-100">{s.desc}</div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}