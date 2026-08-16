"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToolIcon from "./ToolIcons";

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  category: string;
}

const TOOLS: ToolItem[] = [
  { id: "image-compressor", name: "Image Compressor", desc: "Lossless & lossy web-worker compression", category: "Images" },
  { id: "pdf-merger", name: "PDF Merger", desc: "Combine multiple PDF files into one", category: "PDF" },
  { id: "pdf-organizer", name: "PDF Splitter & Deletor", desc: "Reorder, split, and remove pages", category: "PDF" },
  { id: "image-to-pdf", name: "Image to PDF", desc: "Convert multiple images to PDF document", category: "PDF" },
  { id: "image-resizer", name: "Image Resizer", desc: "Batch resize dimensions & aspect ratios", category: "Images" },
  { id: "privacy-redactor", name: "Privacy Redactor", desc: "Black out sensitive text & metadata", category: "Privacy" },
  { id: "json-formatter", name: "JSON Formatter", desc: "Prettify, minify, and validate JSON", category: "Developer" },
  { id: "diff-checker", name: "Text Diff Checker", desc: "Compare side-by-side text differences", category: "Developer" },
  { id: "base64-codec", name: "Base64 Codec", desc: "Encode & decode string or binary files", category: "Developer" },
  { id: "svg-converter", name: "SVG Converter", desc: "Convert SVG vectors to PNG, WebP, JPG", category: "Images" },
  { id: "heic-converter", name: "HEIC to JPEG", desc: "Decode Apple HEIC/HEIF images locally", category: "Images" },
  { id: "qr-generator", name: "QR Code Generator", desc: "Create high-res SVG/PNG QR codes", category: "Utility" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "/" && !isInput) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    try {
      const recents: string[] = JSON.parse(localStorage.getItem("pt_recent_tools") || "[]");
      const updated = [id, ...recents.filter((item) => item !== id)].slice(0, 5);
      localStorage.setItem("pt_recent_tools", JSON.stringify(updated));
    } catch {}

    setIsOpen(false);
    setSearch("");
    router.push(`/${id}`);
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
    } else if (e.key === "Enter" && filteredTools[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredTools[selectedIndex].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-md p-4">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleListKeyDown}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Search tools... (e.g. compress, pdf, json)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <kbd className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredTools.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No matching tools found.</div>
          ) : (
            filteredTools.map((tool, idx) => (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition ${
                  idx === selectedIndex
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-slate-800/80 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg">
                    <ToolIcon name={tool.id} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{tool.name}</div>
                    <div className={`text-[11px] ${idx === selectedIndex ? "text-indigo-100" : "text-slate-400"}`}>
                      {tool.desc}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    idx === selectedIndex
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tool.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}