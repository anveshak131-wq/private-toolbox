"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

interface CompressedResult {
  originalName: string;
  originalSize: number;
  compressedSize: number;
  url: string;
}

export default function ClientTool() {
  const [quality, setQuality] = useState<number>(0.7);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CompressedResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            const compressedUrl = URL.createObjectURL(blob);
            setResult({
              originalName: file.name,
              originalSize: file.size,
              compressedSize: blob.size,
              url: compressedUrl,
            });
            setLoading(false);
          },
          "image/jpeg",
          quality
        );
      };
    };

    reader.readAsDataURL(file);
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl mb-12">
      {/* Navigation Link */}
      <div className="mb-6">
        <Link href="/" className="text-xs text-indigo-400 hover:underline inline-block">
          ← Back to All Tools
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">🔒 Private Image Compressor</h1>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
          100% In-Browser
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Compress your images directly inside your browser. No files are ever uploaded to any server.
      </p>

      {/* Quality Controls */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-slate-300">
          Compression Quality: {Math.round(quality * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
        />
      </div>

      {/* File Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-850 hover:bg-slate-800/50 transition duration-200 rounded-xl p-8 text-center cursor-pointer mb-6"
      >
        <p className="text-sm font-medium text-slate-300">
          {loading ? "Compressing image..." : "Click to select an image (JPG, PNG, WebP)"}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Output Results */}
      {result && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Original Size:</span>
            <span className="font-semibold text-slate-200">{formatSize(result.originalSize)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Compressed Size:</span>
            <span className="font-semibold text-emerald-400">{formatSize(result.compressedSize)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Savings:</span>
            <span className="font-semibold text-indigo-400">
              {Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)}%
            </span>
          </div>

          <a
            href={result.url}
            download={`compressed-${result.originalName}`}
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition duration-150"
          >
            Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
}