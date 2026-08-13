"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (pdfUrl) setPdfUrl(null);
  };

  const convertToPdf = async () => {
    if (files.length === 0) return;
    setLoading(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;

        if (file.type === "image/png") {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else {
          // Fallback for WebP/other formats via Canvas rendering
          const bitmap = await createImageBitmap(file);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(bitmap, 0, 0);
          const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
          const response = await fetch(jpegDataUrl);
          const jpegBytes = await response.arrayBuffer();
          image = await pdfDoc.embedJpg(jpegBytes);
        }

        // Add a page sized exactly to the image
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Failed to convert images to PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
          <Link href="/" className="text-xs text-indigo-400 hover:underline inline-block">
            ← Back to All Tools
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">📄 Private Image to PDF</h1>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
            100% In-Browser
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Convert JPG, PNG, or WebP photos into a PDF document without uploading them to any server.
        </p>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-850 hover:bg-slate-800/50 transition duration-200 rounded-xl p-6 text-center cursor-pointer mb-6 relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <p className="text-sm font-medium text-slate-300">
            Click or drag & drop images here (JPG, PNG, WebP)
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mb-6 space-y-2">
            <h3 className="text-sm font-medium text-slate-300">
              Selected Images ({files.length}):
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
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={convertToPdf}
          disabled={files.length === 0 || loading}
          className={`w-full py-3 rounded-lg font-medium transition duration-150 ${
            files.length === 0 || loading
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          {loading ? "Converting..." : `Convert ${files.length} Image${files.length > 1 ? "s" : ""} to PDF`}
        </button>

        {pdfUrl && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <p className="text-emerald-400 font-medium text-sm mb-3">
              🎉 PDF Generated Successfully!
            </p>
            <a
              href={pdfUrl}
              download="converted-images.pdf"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition"
            >
              Download PDF
            </a>
          </div>
        )}
      </div>
    </main>
  );
}