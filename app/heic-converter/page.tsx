"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import Link from "next/link";

export default function HeicConverterPage() {
  const [loading, setLoading] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");

  const handleConvert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setConvertedUrl(null);

    try {
      // Dynamic import to prevent SSR 'window is not defined' build errors
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default || heic2anyModule;

      const resultBlob = await heic2any({
        blob: file,
        toType: format,
        quality: 0.9,
      });

      const singleBlob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
      const url = URL.createObjectURL(singleBlob);
      setConvertedUrl(url);
    } catch (err) {
      alert("Failed to parse HEIC file. Ensure the image is a valid HEIC/HEIF file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link href="/" className="text-xs text-indigo-400 hover:underline">← Back to Tools</Link>
        <h1 className="text-2xl font-bold text-white mt-1">HEIC to JPEG/PNG Converter</h1>
        <p className="text-xs text-slate-400">Convert Apple iPhone HEIC/HEIF photos directly into standard web formats.</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Target Format</label>
          <select
            value={format}
            onChange={(e: any) => setFormat(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
          >
            <option value="image/jpeg">JPEG (.jpg)</option>
            <option value="image/png">PNG (.png)</option>
          </select>
        </div>

        <div className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer relative bg-slate-950/40">
          <input
            type="file"
            accept=".heic,.heif"
            onChange={handleConvert}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="text-3xl mb-2">📸</div>
          <p className="text-sm font-semibold text-white">Click or drag an Apple .HEIC file here</p>
          <p className="text-xs text-slate-400 mt-1">Zero server uploads. 100% processed locally.</p>
        </div>

        {loading && <p className="text-center text-xs text-indigo-400 animate-pulse">Decoding HEIC image directly in browser...</p>}

        {convertedUrl && (
          <div className="text-center space-y-3 pt-4 border-t border-slate-800">
            <p className="text-xs text-emerald-400 font-semibold">✓ Image Converted Successfully!</p>
            <a
              href={convertedUrl}
              download={`converted-image.${format === "image/jpeg" ? "jpg" : "png"}`}
              className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </main>
  );
}