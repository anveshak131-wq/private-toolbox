"use client";

import React, { useState } from "react";

interface ImageCompareSliderProps {
  originalSrc: string;
  compressedSrc: string;
  originalLabel?: string;
  compressedLabel?: string;
  bgMode?: "dark" | "light" | "checker";
}

export default function ImageCompareSlider({
  originalSrc,
  compressedSrc,
  originalLabel = "Original",
  compressedLabel = "Compressed",
  bgMode = "checker",
}: ImageCompareSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const bgClasses = {
    dark: "bg-slate-950",
    light: "bg-white",
    checker: "bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] bg-slate-900",
  }[bgMode];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div
      className={`relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 select-none cursor-ew-resize ${bgClasses}`}
      onMouseDown={() => setIsResizing(true)}
      onMouseUp={() => setIsResizing(false)}
      onMouseLeave={() => setIsResizing(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Compressed / Processed Layer (Full Background) */}
      <img
        src={compressedSrc}
        alt="Compressed preview"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div className="absolute top-3 right-3 bg-indigo-600/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
        {compressedLabel}
      </div>

      {/* Original Layer (Clipped by Slider) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={originalSrc}
          alt="Original preview"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ width: "100%", maxWidth: "none" }}
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
          {originalLabel}
        </div>
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)] pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900 text-xs font-bold pointer-events-none">
          ⟷
        </div>
      </div>
    </div>
  );
}