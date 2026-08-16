"use client";

import React, { useState } from "react";
import { sounds } from "../lib/soundEffects";
import { downloadZipBundle } from "../lib/downloadHelpers";

export default function BatchConverterPage() {
  const [targetFormat, setTargetFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/webp");
  const [processing, setProcessing] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setProcessing(true);
    sounds.playPop();

    const outputList: { name: string; blob: Blob }[] = [];
    const ext = targetFormat === "image/png" ? "png" : targetFormat === "image/jpeg" ? "jpg" : "webp";

    for (const file of files) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res) => (img.onload = res));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), targetFormat, 0.9));
      outputList.push({ name: `${file.name.replace(/\.[^/.]+$/, "")}.${ext}`, blob });
    }

    sounds.playSuccess();
    await downloadZipBundle(outputList, `converted-${ext}-bundle.zip`);
    setProcessing(false);
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Batch Image Format Converter</h1>
        <p className="text-xs text-slate-400">Convert batches of PNG, JPG, and WebP images simultaneously into a zipped package.</p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(["image/webp", "image/png", "image/jpeg"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setTargetFormat(fmt)}
              className={`py-2 rounded-lg text-xs font-bold transition uppercase ${
                targetFormat === fmt ? "bg-indigo-600 text-white" : "text-slate-400"
              }`}
            >
              {fmt.replace("image/", "")}
            </button>
          ))}
        </div>

        <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl block text-center cursor-pointer transition bg-slate-950/40">
          <span className="text-3xl mb-2 block">📦</span>
          <span className="text-xs font-bold text-white">Select multiple images to convert</span>
          <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </label>

        {processing && (
          <div className="text-center text-xs font-bold text-indigo-400 animate-pulse">
            Converting and packaging .zip file...
          </div>
        )}
      </div>
    </main>
  );
}