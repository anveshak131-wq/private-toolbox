"use client";

import React from "react";

interface ToolIconProps {
  name: string;
  className?: string;
}

export default function ToolIcon({ name, className = "w-6 h-6" }: ToolIconProps) {
  switch (name) {
    case "image-compressor":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" className="stroke-indigo-400" />
          <circle cx="8.5" cy="8.5" r="1.5" className="fill-indigo-400 stroke-none" />
          <path d="m21 15-5-5L5 21" className="stroke-indigo-400/80" />
          <path d="M9 12l3-3 3 3" className="stroke-emerald-400" />
          <path d="M9 16l3 3 3-3" className="stroke-emerald-400" />
        </svg>
      );

    case "pdf-merger":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="stroke-rose-400" />
          <polyline points="14 2 14 8 20 8" className="stroke-rose-400" />
          <path d="M12 18v-6" className="stroke-indigo-400" />
          <path d="M9 15h6" className="stroke-indigo-400" />
        </svg>
      );

    case "pdf-organizer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="3" className="stroke-rose-400/70" />
          <path d="M8 7h8" className="stroke-slate-500" />
          <path d="M8 11h8" className="stroke-slate-500" />
          <circle cx="6" cy="17" r="2" className="stroke-amber-400" />
          <circle cx="18" cy="17" r="2" className="stroke-amber-400" />
          <path d="m8 17 8-3" className="stroke-amber-400" />
        </svg>
      );

    case "image-to-pdf":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16l4-4a2 2 0 0 1 2.8 0L14 15" className="stroke-cyan-400" />
          <rect x="2" y="4" width="12" height="12" rx="2" className="stroke-cyan-400" />
          <path d="M16 8h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-4" className="stroke-rose-400" />
          <polyline points="15 13 18 10 21 13" className="stroke-indigo-400" />
        </svg>
      );

    case "image-resizer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" className="stroke-indigo-400/60" strokeDasharray="3 3" />
          <rect x="3" y="9" width="12" height="12" rx="2" className="stroke-indigo-400" />
          <path d="M15 3h6v6" className="stroke-pink-400" />
          <path d="m21 3-7 7" className="stroke-pink-400" />
        </svg>
      );

    case "privacy-redactor":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-emerald-400" />
          <rect x="7" y="10" width="10" height="3" rx="1.5" className="fill-emerald-400/30 stroke-emerald-400" />
          <rect x="8.5" y="14.5" width="7" height="2.5" rx="1" className="fill-emerald-400/30 stroke-emerald-400" />
        </svg>
      );

    case "metadata-stripper":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" className="stroke-emerald-400" />
          <path d="m4.93 4.93 14.14 14.14" className="stroke-rose-400" />
          <path d="M12 8v4" className="stroke-slate-400" />
          <path d="M12 16h.01" className="stroke-slate-400" />
        </svg>
      );

    case "file-encryptor":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" className="stroke-emerald-400" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" className="stroke-emerald-400" />
          <circle cx="12" cy="16" r="1.5" className="fill-emerald-400 stroke-none" />
        </svg>
      );

    case "password-generator":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2l-2 2m-1.5 6.1L19 8l-4-4-2.1 1.5M10.5 13.5L3 21l3 3 7.5-7.5" className="stroke-amber-400" />
          <circle cx="16.5" cy="7.5" r="4.5" className="stroke-amber-400" />
        </svg>
      );

    case "audio-trimmer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" className="stroke-purple-400" />
          <circle cx="6" cy="18" r="3" className="stroke-purple-400" />
          <circle cx="18" cy="16" r="3" className="stroke-purple-400" />
          <path d="m3 3 18 18" className="stroke-rose-400/80" />
        </svg>
      );

    case "color-palette":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" className="fill-pink-400 stroke-none" />
          <circle cx="17.5" cy="10.5" r=".5" className="fill-indigo-400 stroke-none" />
          <circle cx="8.5" cy="7.5" r=".5" className="fill-amber-400 stroke-none" />
          <circle cx="6.5" cy="12.5" r=".5" className="fill-emerald-400 stroke-none" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.438 6.5 17.5 2 12 2z" className="stroke-pink-400" />
        </svg>
      );

    case "favicon-generator":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" className="stroke-cyan-400" />
          <line x1="8" y1="21" x2="16" y2="21" className="stroke-slate-500" />
          <line x1="12" y1="17" x2="12" y2="21" className="stroke-slate-500" />
          <circle cx="6" cy="7" r="1" className="fill-cyan-400 stroke-none" />
        </svg>
      );

    case "markdown-preview":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" className="stroke-indigo-400" />
          <path d="M7 8v8l3-3 3 3V8" className="stroke-indigo-300" />
          <path d="M17 12l-2-2v6" className="stroke-indigo-300" />
        </svg>
      );

    case "word-counter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" className="stroke-sky-400" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" className="stroke-sky-400" />
          <line x1="8" y1="6" x2="16" y2="6" className="stroke-sky-300" />
          <line x1="8" y1="10" x2="16" y2="10" className="stroke-sky-300" />
        </svg>
      );

    case "case-converter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7V5h6v2" className="stroke-emerald-400" />
          <path d="M6 5v14" className="stroke-emerald-400" />
          <path d="M13 12v-2h6v2" className="stroke-cyan-400" />
          <path d="M16 10v9" className="stroke-cyan-400" />
        </svg>
      );

    case "json-formatter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H6a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h2" className="stroke-amber-400" />
          <path d="M16 3h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-2" className="stroke-amber-400" />
          <circle cx="9" cy="12" r="1" className="fill-amber-400 stroke-none" />
          <circle cx="12" cy="12" r="1" className="fill-amber-400 stroke-none" />
          <circle cx="15" cy="12" r="1" className="fill-amber-400 stroke-none" />
        </svg>
      );

    case "diff-checker":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="8" height="18" rx="2" className="stroke-slate-500" />
          <rect x="13" y="3" width="8" height="18" rx="2" className="stroke-slate-500" />
          <line x1="5.5" y1="8" x2="8.5" y2="8" className="stroke-rose-400" />
          <line x1="15.5" y1="8" x2="18.5" y2="8" className="stroke-emerald-400" />
          <line x1="17" y1="6.5" x2="17" y2="9.5" className="stroke-emerald-400" />
          <line x1="5.5" y1="13" x2="8.5" y2="13" className="stroke-rose-400" />
          <line x1="15.5" y1="13" x2="18.5" y2="13" className="stroke-emerald-400" />
        </svg>
      );

    case "base64-codec":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7l4 4-4 4" className="stroke-indigo-400" />
          <path d="M20 7l-4 4 4 4" className="stroke-indigo-400" />
          <path d="M14 4l-4 16" className="stroke-purple-400" />
          <circle cx="9" cy="6" r="1" className="fill-cyan-400 stroke-none" />
          <circle cx="15" cy="18" r="1" className="fill-cyan-400 stroke-none" />
        </svg>
      );

    case "svg-converter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" className="stroke-pink-400" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" className="stroke-pink-400" />
          <path d="m2 2 7.586 7.586" className="stroke-pink-400" />
          <circle cx="11" cy="11" r="2" className="stroke-pink-300 fill-pink-500/20" />
        </svg>
      );

    case "heic-converter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" className="stroke-violet-400" />
          <circle cx="12" cy="13" r="4" className="stroke-violet-400" />
          <path d="M12 9v2" className="stroke-cyan-300" />
          <path d="M12 15v2" className="stroke-cyan-300" />
        </svg>
      );

    case "qr-generator":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" className="stroke-indigo-400" />
          <rect x="5" y="5" width="3" height="3" className="fill-indigo-400 stroke-none" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" className="stroke-indigo-400" />
          <rect x="16" y="5" width="3" height="3" className="fill-indigo-400 stroke-none" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" className="stroke-indigo-400" />
          <rect x="5" y="16" width="3" height="3" className="fill-indigo-400 stroke-none" />
          <path d="M14 14h3v3h-3z" className="fill-indigo-400 stroke-none" />
          <path d="M17 17h4v4h-4z" className="fill-indigo-400 stroke-none" />
          <path d="M14 20h3" className="stroke-indigo-400" />
        </svg>
      );

    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" className="stroke-indigo-400" />
          <path d="M12 8v8" className="stroke-indigo-400" />
          <path d="M8 12h8" className="stroke-indigo-400" />
        </svg>
      );
  }
}