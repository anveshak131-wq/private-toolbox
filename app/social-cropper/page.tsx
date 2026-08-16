"use client";

import React, { useState, useRef } from "react";
import { sounds } from "../lib/soundEffects";

const PRESETS = [
  { name: "Square (1:1)", ratio: 1 / 1, desc: "Instagram Post" },
  { name: "Portrait (4:5)", ratio: 4 / 5, desc: "Instagram Feed" },
  { name: "Landscape (16:9)", ratio: 16 / 9, desc: "YouTube / Twitter" },
  { name: "Banner (3:1)", ratio: 3 / 1, desc: "Twitter Header" },
];

export default function SocialCropperPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<number>(1 / 1);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playPop();
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleCropAndSave = () => {
    if (!imageSrc) return;
    sounds.playSuccess();

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;

      if (w / h > selectedRatio) {
        w = h * selectedRatio;
      } else {
        h = w / selectedRatio;
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, (img.width - w) / 2, (img.height - h) / 2, w, h, 0, 0, w, h);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "social-crop.png";
      a.click();
    };
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Social Media Aspect Cropper</h1>
        <p className="text-xs text-slate-400">Crop images to standardized social media dimensions without black bars.</p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6">
        <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl block text-center cursor-pointer transition bg-slate-950/40">
          <span className="text-2xl mb-1 block">📐</span>
          <span className="text-xs font-bold text-white">Upload image to fit aspect ratio</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                sounds.playPop();
                setSelectedRatio(p.ratio);
              }}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedRatio === p.ratio
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold">{p.name}</div>
              <div className="text-[10px] opacity-70">{p.desc}</div>
            </button>
          ))}
        </div>

        {imageSrc && (
          <button
            onClick={handleCropAndSave}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
          >
            ✂️ Crop & Download Image
          </button>
        )}
      </div>
    </main>
  );
}