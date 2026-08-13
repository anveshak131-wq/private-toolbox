"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "Image" | "PDF" | "Utility";
  href: string;
  status: "Ready" | "Coming Soon";
}

const TOOLS: Tool[] = [
  {
    id: "image-compressor",
    title: "Image Compressor",
    description: "Compress JPG, PNG & WebP images without quality loss.",
    icon: "🖼️",
    category: "Image",
    href: "/image-compressor",
    status: "Ready",
  },
  {
    id: "pdf-merger",
    title: "PDF Merger",
    description: "Combine multiple PDF documents into one seamless file.",
    icon: "📑",
    category: "PDF",
    href: "/pdf-merger",
    status: "Ready",
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert photos into a single clean PDF document.",
    icon: "📄",
    category: "PDF",
    href: "/image-to-pdf",
    status: "Ready",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize pixels & convert formats (PNG, JPG, WebP).",
    icon: "📐",
    category: "Image",
    href: "/image-resizer",
    status: "Ready",
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description: "Create custom downloadable QR codes for links & text.",
    icon: "📱",
    category: "Utility",
    href: "/qr-generator",
    status: "Ready",
  },
  {
    id: "privacy-redactor",
    title: "Privacy Redactor",
    description: "Blackout sensitive info on screenshots privately.",
    icon: "🙈",
    category: "Image",
    href: "/privacy-redactor",
    status: "Ready",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Image", "PDF", "Utility"];

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Hero Banner */}
        <div className="text-center space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-3.5 py-1.5 rounded-full font-medium shadow-inner">
            <span>🚀 Zero Server Uploads</span>
            <span className="text-slate-600">•</span>
            <span>Unlimited Free Usage</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Private Web Utility <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">Toolbox</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            All file processing happens 100% inside your browser using client-side WebAssembly. Your photos, documents, and data never leave your device.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search tools (e.g. compress, PDF)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition placeholder:text-slate-600"
            />
            <span className="absolute left-3 top-3 text-slate-500 text-sm">🔍</span>
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition duration-200 ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid with Micro-Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition duration-300">
                    {tool.icon}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      tool.status === "Ready"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition">
                  {tool.title}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href={tool.href}
                  className="flex items-center justify-center gap-1.5 w-full text-center bg-slate-950 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white text-xs font-semibold py-2.5 rounded-xl border border-slate-800 group-hover:border-indigo-500 transition duration-200"
                >
                  <span>Use Tool</span>
                  <span className="group-hover:translate-x-1 transition duration-200">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}