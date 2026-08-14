"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function PdfOrganizerPage() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesToKeep, setPagesToKeep] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    setPdfBytes(arrayBuffer);

    const doc = await PDFDocument.load(arrayBuffer);
    const count = doc.getPageCount();
    setPageCount(count);
    setPagesToKeep(`1-${count}`);
  };

  const handleExport = async () => {
    if (!pdfBytes) return;
    setProcessing(true);

    try {
      const srcDoc = await PDFDocument.load(pdfBytes);
      const newDoc = await PDFDocument.create();

      // Parse ranges like "1-3, 5"
      const selectedIndices: number[] = [];
      const parts = pagesToKeep.split(",").map((p) => p.trim());

      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= pageCount) selectedIndices.push(i - 1);
          }
        } else {
          const num = Number(part);
          if (num >= 1 && num <= pageCount) selectedIndices.push(num - 1);
        }
      }

      const copiedPages = await newDoc.copyPages(srcDoc, Array.from(new Set(selectedIndices)));
      copiedPages.forEach((page) => newDoc.addPage(page));

      const outPdfBytes = await newDoc.save();
      
      // Fixed Blob construction with any cast to avoid TypeScript ArrayBufferLike error
      const blob = new Blob([outPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "split-organized.pdf";
      link.click();
    } catch (err) {
      alert("Invalid page range specified. Example: 1-3, 5");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link href="/" className="text-xs text-indigo-400 hover:underline">← Back to Tools</Link>
        <h1 className="text-2xl font-bold text-white mt-1">PDF Page Splitter & Deletor</h1>
        <p className="text-xs text-slate-400">Extract exact page ranges or delete unwanted pages from PDF files.</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-5">
        <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center relative bg-slate-950/40">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="text-3xl mb-2">📑</div>
          <p className="text-sm font-semibold text-white">Select a PDF file</p>
          {pageCount > 0 && <p className="text-xs text-emerald-400 mt-1 font-semibold">Loaded: {pageCount} pages</p>}
        </div>

        {pageCount > 0 && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pages to Keep (comma separated or ranges, e.g. 1-3, 5)
              </label>
              <input
                type="text"
                value={pagesToKeep}
                onChange={(e) => setPagesToKeep(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleExport}
              disabled={processing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow"
            >
              {processing ? "Extracting Pages..." : "Save & Download Extracted PDF"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}