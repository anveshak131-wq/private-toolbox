"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function ClientTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (mergedUrl) setMergedUrl(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setLoading(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Failed to merge PDFs. Make sure files are not password-protected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/" className="text-xs text-indigo-400 hover:underline mb-1 inline-block">
            ← Back to All Tools
          </Link>
          <h1 className="text-2xl font-bold text-white">📑 Private PDF Merger</h1>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
          100% In-Browser
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Combine multiple PDF documents into a single file. No data leaves your computer.
      </p>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-850 hover:bg-slate-800/50 transition duration-200 rounded-xl p-6 text-center cursor-pointer mb-6 relative">
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <p className="text-sm font-medium text-slate-300">
          Click or drag & drop PDF files here to upload
        </p>
        <p className="text-xs text-slate-500 mt-1">Select 2 or more files</p>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="text-sm font-medium text-slate-300">
            Selected Files ({files.length}):
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm"
              >
                <span className="truncate max-w-[80%] text-slate-300">
                  {idx + 1}. {file.name}
                </span>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={mergePdfs}
        disabled={files.length < 2 || loading}
        className={`w-full py-3 rounded-lg font-medium transition duration-150 ${
          files.length < 2 || loading
            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500 text-white"
        }`}
      >
        {loading ? "Merging PDFs..." : `Merge ${files.length} PDFs`}
      </button>

      {/* Download Output */}
      {mergedUrl && (
        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
          <p className="text-emerald-400 font-medium text-sm mb-3">
            🎉 PDFs merged successfully!
          </p>
          <a
            href={mergedUrl}
            download="merged-document.pdf"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg transition duration-150 text-sm"
          >
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
}