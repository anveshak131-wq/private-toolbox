"use client";

import React, { useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { sounds } from "../lib/soundEffects";

export default function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [processing, setProcessing] = useState(false);

  const handleApply = async () => {
    if (!file) return;
    setProcessing(true);
    sounds.playPop();

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();

        // Watermark Text
        if (text) {
          page.drawText(text, {
            x: width / 4,
            y: height / 2,
            size: 42,
            font,
            color: rgb(0.8, 0.2, 0.2),
            opacity: 0.18,
            rotate: degrees(45),
          });
        }

        // Page Number
        if (includePageNumbers) {
          const pageStr = `Page ${idx + 1} of ${pages.length}`;
          page.drawText(pageStr, {
            x: width / 2 - 30,
            y: 20,
            size: 10,
            font,
            color: rgb(0.4, 0.4, 0.4),
          });
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `watermarked-${file.name}`;
      a.click();
      sounds.playSuccess();
    } catch {
      alert("Error applying watermark to PDF.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">PDF Watermark & Page Numberer</h1>
        <p className="text-xs text-slate-400">Stamp security watermarks and dynamic page counts directly into PDF vector pages.</p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">1. Select PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-slate-200 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">2. Diagonal Watermark Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includePageNumbers}
            onChange={(e) => setIncludePageNumbers(e.target.checked)}
            className="rounded bg-slate-950 border-slate-700 text-indigo-600"
          />
          <span>Add "Page X of Y" Footer</span>
        </label>

        <button
          onClick={handleApply}
          disabled={!file || processing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
        >
          {processing ? "Stamping PDF In Memory..." : "Stamp & Download PDF"}
        </button>
      </div>
    </main>
  );
}