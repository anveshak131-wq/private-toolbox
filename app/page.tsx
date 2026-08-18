"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolIcon from "./components/ToolIcons";
import SmartHeroDropzone from "./components/SmartHeroDropzone";

interface ToolDef {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: "pdf" | "images" | "privacy" | "dev";
}

const TOOLS: ToolDef[] = [
  // Document & PDF Suite
  {
    id: "ocr-reader",
    title: "Client-Side OCR",
    description: "Extract text from scanned documents and screenshots locally via Tesseract.",
    badge: "WASM",
    category: "pdf",
  },
  {
    id: "pdf-merger",
    title: "PDF Merger",
    description: "Combine multiple PDF documents into a single organized file in seconds.",
    badge: "Fast",
    category: "pdf",
  },
  {
    id: "pdf-organizer",
    title: "PDF Splitter & Organizer",
    description: "Rearrange, rotate, split, and extract PDF pages visually.",
    badge: "Visual",
    category: "pdf",
  },
  {
    id: "pdf-watermark",
    title: "PDF Watermark",
    description: "Stamp security watermarks and custom page counts onto PDF pages.",
    badge: "Vector",
    category: "pdf",
  },
  {
    id: "pdf-security",
    title: "PDF Password Locker",
    description: "Lock confidential PDFs with client-side AES encryption.",
    badge: "AES-256",
    category: "pdf",
  },
  {
    id: "invoice-generator",
    title: "Invoice Maker",
    description: "Generate clean PDF invoices with automatic tax and total calculation.",
    badge: "PDF",
    category: "pdf",
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert batches of JPG, PNG, and WebP images into a single PDF document.",
    badge: "Batch",
    category: "pdf",
  },

  // Images & Graphics
  {
    id: "image-compressor",
    title: "Image Compressor",
    description: "Losslessly compress PNG, JPG, and WebP files with instant split inspection.",
    badge: "Canvas",
    category: "images",
  },
  {
    id: "signature-drawer",
    title: "Signature Pad",
    description: "Draw electronic signatures and export transparent smooth PNG vectors.",
    badge: "Vector",
    category: "images",
  },
  {
    id: "social-cropper",
    title: "Aspect Cropper",
    description: "Crop images to standard social media aspect ratios without distortion.",
    badge: "Auto-Fit",
    category: "images",
  },
  {
    id: "batch-converter",
    title: "Batch Format Converter",
    description: "Convert batches of images between WebP, PNG, and JPG in one click.",
    badge: "Batch",
    category: "images",
  },
  {
    id: "color-contrast-simulator",
    title: "WCAG Contrast Checker",
    description: "Test foreground and background combinations against WCAG accessibility targets.",
    badge: "WCAG",
    category: "images",
  },

  // Privacy & Security
  {
    id: "secure-note",
    title: "Zero-Knowledge Note",
    description: "Share secret notes where data lives entirely in the URL hash fragment.",
    badge: "Encrypted",
    category: "privacy",
  },
  {
    id: "checksum-verifier",
    title: "File Checksum Verifier",
    description: "Compute and verify SHA-256, SHA-512, and MD5 hashes in memory.",
    badge: "WebCrypto",
    category: "privacy",
  },
  {
    id: "metadata-stripper",
    title: "EXIF & Metadata Stripper",
    description: "Strip GPS coordinates and camera metadata from photos before sharing.",
    badge: "Sanitize",
    category: "privacy",
  },
  {
    id: "file-encryptor",
    title: "File Encryptor",
    description: "Encrypt and decrypt files using military-grade AES-256-GCM in memory.",
    badge: "AES-GCM",
    category: "privacy",
  },
  {
    id: "fingerprint-analyzer",
    title: "Browser Fingerprint",
    description: "Inspect hardware identifiers and sandbox permissions your browser exposes.",
    badge: "Audit",
    category: "privacy",
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate cryptographically secure passwords with entropy controls.",
    badge: "Crypto",
    category: "privacy",
  },

  // Developer Text & Code
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON trees directly in memory.",
    badge: "Dev",
    category: "dev",
  },
  {
    id: "diff-checker",
    title: "Diff Checker",
    description: "Compare two text or code snippets with side-by-side syntax highlighting.",
    badge: "Diff",
    category: "dev",
  },
  {
    id: "markdown-preview",
    title: "Markdown Live Editor",
    description: "Real-time Markdown editor with live GitHub-flavored HTML preview.",
    badge: "Markdown",
    category: "dev",
  },
  {
    id: "base64-codec",
    title: "Base64 Encoder / Decoder",
    description: "Encode and decode raw strings, files, and data URLs locally.",
    badge: "Codec",
    category: "dev",
  },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredTools = TOOLS.filter((t) => {
    if (activeCategory === "all") return true;
    return t.category === activeCategory;
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      {/* Refined Minimal Hero */}
      <section className="space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>100% Client-Side • Zero Server Uploads</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Developer & File Utilities
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-lg">
          Fast, private tools that process PDFs, images, encryption, and text directly inside your browser memory.
        </p>
      </section>

      {/* Hero Dropzone */}
      <SmartHeroDropzone />

      {/* Category Navigation Bar */}
      <section className="space-y-6">
        <div className="flex items-center gap-1.5 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3 overflow-x-auto">
          {[
            { id: "all", label: "All Tools" },
            { id: "pdf", label: "PDF & OCR" },
            { id: "images", label: "Images & Media" },
            { id: "privacy", label: "Privacy & Security" },
            { id: "dev", label: "Developer Tools" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activeCategory === tab.id
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Crisp, Minimal Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="group flex flex-col justify-between p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition hover:bg-neutral-50/50 dark:hover:bg-neutral-900/70"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/70 text-neutral-700 dark:text-neutral-300">
                    <ToolIcon name={tool.id} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-200/60 dark:border-neutral-800/60">
                    {tool.badge}
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {tool.title}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 flex items-center justify-between">
                <span>Open tool</span>
                <span className="group-hover:translate-x-0.5 transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}