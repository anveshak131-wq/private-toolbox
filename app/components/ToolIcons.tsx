"use client";

import React from "react";

interface ToolIconProps {
  name: string;
  className?: string;
}

export default function ToolIcon({ name, className = "w-6 h-6" }: ToolIconProps) {
  switch (name) {
    // 1. Document & OCR
    case "ocr-reader":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7V4h3" className="stroke-cyan-400" />
          <path d="M20 7V4h-3" className="stroke-cyan-400" />
          <path d="M4 17v3h3" className="stroke-cyan-400" />
          <path d="M20 17v3h-3" className="stroke-cyan-400" />
          <line x1="4" y1="12" x2="20" y2="12" className="stroke-indigo-400" strokeDasharray="2 2" />
          <path d="M9 15l3-6 3 6" className="stroke-white" />
          <line x1="10" y1="13" x2="14" y2="13" className="stroke-white" />
        </svg>
      );

    case "pdf-watermark":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="stroke-rose-400" />
          <polyline points="14 2 14 8 20 8" className="stroke-rose-400" />
          <path d="M8 16l8-8" className="stroke-amber-400" strokeDasharray="2 2" />
          <circle cx="12" cy="12" r="3" className="stroke-amber-400" />
        </svg>
      );

    case "pdf-security":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="stroke-rose-400" />
          <rect x="8" y="12" width="8" height="6" rx="1" className="stroke-emerald-400" />
          <path d="M10 12V10a2 2 0 0 1 4 0v2" className="stroke-emerald-400" />
        </svg>
      );

    case "invoice-generator":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="stroke-indigo-400" />
          <line x1="8" y1="12" x2="16" y2="12" className="stroke-emerald-400" />
          <line x1="8" y1="16" x2="12" y2="16" className="stroke-slate-400" />
          <circle cx="15" cy="16" r="1.5" className="fill-emerald-400 stroke-none" />
        </svg>
      );

    // 2. Graphics & Image
    case "signature-drawer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21l3-1 11-11-2-2L4 18l-1 3z" className="stroke-pink-400" />
          <path d="M14.5 5.5l2 2" className="stroke-pink-400" />
          <path d="M3 21c3-2 6-1 9-2s5-3 9-3" className="stroke-indigo-400" />
        </svg>
      );

    case "social-cropper":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2v16h16" className="stroke-indigo-400" />
          <path d="M2 6h16v16" className="stroke-indigo-400" />
          <rect x="9" y="9" width="6" height="6" rx="1" className="stroke-amber-400" strokeDasharray="2 2" />
        </svg>
      );

    case "batch-converter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="9" height="9" rx="2" className="stroke-cyan-400" />
          <rect x="13" y="13" width="9" height="9" rx="2" className="stroke-purple-400" />
          <path d="M7 16h4v-4" className="stroke-emerald-400" />
          <path d="m11 16-5 5" className="stroke-emerald-400" />
          <path d="M17 8h-4v4" className="stroke-emerald-400" />
          <path d="m13 8 5-5" className="stroke-emerald-400" />
        </svg>
      );

    case "color-contrast-simulator":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" className="stroke-slate-500" />
          <path d="M12 3a9 9 0 0 0 0 18z" className="fill-indigo-500 stroke-none" />
          <circle cx="12" cy="12" r="3" className="stroke-amber-400" />
        </svg>
      );

    // 4. Privacy & Security
    case "secure-note":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" className="stroke-emerald-400" />
          <circle cx="8" cy="10" r="1" className="fill-emerald-400 stroke-none" />
          <line x1="11" y1="10" x2="16" y2="10" className="stroke-slate-400" />
          <line x1="8" y1="14" x2="16" y2="14" className="stroke-slate-400" />
          <path d="M17 18l3 3m0-3l-3 3" className="stroke-rose-400" />
        </svg>
      );

    case "checksum-verifier":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-cyan-400" />
          <path d="m9 12 2 2 4-4" className="stroke-emerald-400" />
        </svg>
      );

    case "fingerprint-analyzer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a9 9 0 0 0-9 9c0 3 1.5 6 4 7.5" className="stroke-purple-400" />
          <path d="M12 6a5 5 0 0 0-5 5c0 2 1 4 2.5 5" className="stroke-indigo-400" />
          <path d="M12 10a1 1 0 0 0-1 1c0 1 .5 2 1.5 2.5" className="stroke-emerald-400" />
          <path d="M16 11a4 4 0 0 1-1 3" className="stroke-purple-400" />
          <path d="M20 11a8 8 0 0 1-3 6.5" className="stroke-purple-400" />
        </svg>
      );

    // Existing Tool Fallbacks
    case "image-compressor":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" className="stroke-indigo-400" />
          <circle cx="8.5" cy="8.5" r="1.5" className="fill-indigo-400 stroke-none" />
          <path d="m21 15-5-5L5 21" className="stroke-indigo-400/80" />
        </svg>
      );

    case "pdf-merger":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="stroke-rose-400" />
          <polyline points="14 2 14 8 20 8" className="stroke-rose-400" />
          <path d="M12 18v-6M9 15h6" className="stroke-indigo-400" />
        </svg>
      );

    case "pdf-organizer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="3" className="stroke-rose-400/70" />
          <circle cx="6" cy="17" r="2" className="stroke-amber-400" />
          <circle cx="18" cy="17" r="2" className="stroke-amber-400" />
          <path d="m8 17 8-3" className="stroke-amber-400" />
        </svg>
      );

    case "image-to-pdf":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="12" height="12" rx="2" className="stroke-cyan-400" />
          <path d="M16 8h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8" className="stroke-rose-400" />
        </svg>
      );

    case "metadata-stripper":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" className="stroke-emerald-400" />
          <path d="m4.93 4.93 14.14 14.14" className="stroke-rose-400" />
        </svg>
      );

    case "file-encryptor":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" className="stroke-emerald-400" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" className="stroke-emerald-400" />
        </svg>
      );

    case "password-generator":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2l-2 2-2.1 1.5M10.5 13.5L3 21l3 3 7.5-7.5" className="stroke-amber-400" />
          <circle cx="16.5" cy="7.5" r="4.5" className="stroke-amber-400" />
        </svg>
      );

    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" className="stroke-indigo-400" />
          <path d="M12 8v8M8 12h8" className="stroke-indigo-400" />
        </svg>
      );
  }
}