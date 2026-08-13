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
    description: "Compress JPG, PNG & WebP images without losing quality.",
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
    description: "Convert images (JPG/PNG) into a single clean PDF document.",
    icon: "📄",
    category: "PDF",
    href: "/image-to-pdf",
    status: "Ready",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize dimensions & convert format between PNG, JPG, and WebP.",
    icon: "📐",
    category: "Image",
    href: "/image-resizer",
    status: "Ready",
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description: "Create custom downloadable QR codes for links, Wi-Fi, and text.",
    icon: "📱",
    category: "Utility",
    href: "/qr-generator",
    status: "Coming Soon",
  },
  {
    id: "privacy-redactor",
    title: "Privacy Redactor",
    description: "Blur out sensitive info from screenshots and photos privately.",
    icon: "🙈",
    category: "Image",
    href: "/privacy-redactor",
    status: "Coming Soon",
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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
            🔒 100% Client-Side • Files Never Leave Your Device
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Private Web Utility Toolbox
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Fast, free, and completely private micro-tools. No file uploads to remote servers, no file size limits, and zero data tracking.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search tools (e.g., compress, PDF, blur)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none transition"
          />

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl">{tool.icon}</span>
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
                {tool.status === "Ready" ? (
                  <Link
                    href={tool.href}
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium py-2.5 rounded-xl transition"
                  >
                    Use Tool →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full text-center bg-slate-800 text-slate-500 text-xs font-medium py-2.5 rounded-xl cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}