"use client";

import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import { sounds } from "../lib/soundEffects";
import { copyTextToClipboard } from "../lib/downloadHelpers";

export default function OcrReaderPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setExtractedText("");
    setStatus("Initializing Tesseract Web Worker...");

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setStatus(`Extracting text (${Math.round(m.progress * 100)}%)...`);
          }
        },
      });

      const ret = await worker.recognize(file);
      setExtractedText(ret.data.text);
      sounds.playSuccess();
      setStatus("✓ Recognition complete (100% in-browser)");
      await worker.terminate();
    } catch {
      setStatus("❌ OCR failed to process image.");
    }
  };

  const handleCopy = async () => {
    sounds.playSuccess();
    await copyTextToClipboard(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Client-Side OCR (Text Extractor)</h1>
        <p className="text-xs text-slate-400">Extract editable text from scanned documents and screenshots via Tesseract Web Workers.</p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6">
        <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl block text-center cursor-pointer transition bg-slate-950/40">
          <span className="text-3xl mb-2 block">🔍</span>
          <span className="text-xs font-bold text-white">Select Document or Screenshot</span>
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </label>

        {status && <div className="text-center text-xs font-semibold text-indigo-400">{status}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imageSrc && (
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-center">
              <img src={imageSrc} alt="Scanned Document" className="max-h-80 object-contain rounded-xl" />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Extracted Text</span>
              {extractedText && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
                >
                  {copied ? "✓ Copied" : "Copy Text"}
                </button>
              )}
            </div>
            <textarea
              rows={12}
              value={extractedText}
              readOnly
              placeholder="Extracted characters will appear here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-white outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </main>
  );
}