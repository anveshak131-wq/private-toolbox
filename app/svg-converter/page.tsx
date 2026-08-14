"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import Link from "next/link";

export default function SvgConverterPage() {
  const [svgContent, setSvgContent] = useState("");
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setSvgContent(event.target?.result as string);
    reader.readAsText(file);
  };

  const convertAndDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(blob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width * scale || 800 * scale;
      canvas.height = image.height * scale || 800 * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL(`image/${format}`);
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `rasterized-image.${format}`;
      downloadLink.click();
    };
    image.src = blobURL;
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link href="/" className="text-xs text-indigo-400 hover:underline">← Back to Tools</Link>
        <h1 className="text-2xl font-bold text-white mt-1">SVG to High-Res Image Converter</h1>
        <p className="text-xs text-slate-400">Rasterize SVG vector code or files to PNG, JPEG, or WebP with crisp scale multipliers.</p>
      </div>

      <div className="space-y-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Upload SVG File or Paste Code Below</label>
          <input
            type="file"
            accept=".svg"
            onChange={handleFileUpload}
            className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />
        </div>

        <textarea
          rows={6}
          value={svgContent}
          onChange={(e) => setSvgContent(e.target.value)}
          placeholder="<svg ...> ... </svg>"
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Target Format</label>
            <select
              value={format}
              onChange={(e: any) => setFormat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
            >
              <option value="png">PNG (Transparent Background)</option>
              <option value="jpeg">JPEG (White Background)</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Resolution Multiplier</label>
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
            >
              <option value="1">1x (Standard)</option>
              <option value="2">2x (High Res / Retina)</option>
              <option value="4">4x (Ultra HD)</option>
            </select>
          </div>
        </div>

        <button
          onClick={convertAndDownload}
          disabled={!svgContent}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition"
        >
          Rasterize and Download Image
        </button>
      </div>
    </main>
  );
}