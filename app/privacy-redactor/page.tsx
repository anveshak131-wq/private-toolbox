"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function PrivacyRedactor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [rects, setRects] = useState<Rect[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setRects([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      setTimeout(() => drawCanvas(src, []), 50);
    };
    reader.readAsDataURL(file);
  };

  const drawCanvas = (src: string, currentRects: Rect[], tempRect?: Rect) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw base image
      ctx.drawImage(img, 0, 0);

      // Draw saved blackout boxes
      ctx.fillStyle = "black";
      currentRects.forEach((r) => {
        ctx.fillRect(r.x, r.y, r.w, r.h);
      });

      // Draw active dragging box
      if (tempRect) {
        ctx.fillRect(tempRect.x, tempRect.y, tempRect.w, tempRect.h);
      }
    };
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageSrc) return;
    const coords = getCanvasCoords(e);
    setStartPos(coords);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !imageSrc) return;
    const current = getCanvasCoords(e);
    const tempRect: Rect = {
      x: Math.min(startPos.x, current.x),
      y: Math.min(startPos.y, current.y),
      w: Math.abs(current.x - startPos.x),
      h: Math.abs(current.y - startPos.y),
    };
    drawCanvas(imageSrc, rects, tempRect);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !imageSrc) return;
    const current = getCanvasCoords(e);
    const newRect: Rect = {
      x: Math.min(startPos.x, current.x),
      y: Math.min(startPos.y, current.y),
      w: Math.abs(current.x - startPos.x),
      h: Math.abs(current.y - startPos.y),
    };

    if (newRect.w > 5 && newRect.h > 5) {
      const updated = [...rects, newRect];
      setRects(updated);
      drawCanvas(imageSrc, updated);
    }
    setIsDrawing(false);
  };

  const clearRedactions = () => {
    setRects([]);
    if (imageSrc) drawCanvas(imageSrc, []);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `redacted-${fileName || "image.png"}`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
          <Link href="/" className="text-xs text-indigo-400 hover:underline inline-block">
            ← Back to All Tools
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">🙈 Privacy Screenshot Redactor</h1>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
            100% In-Browser
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Click and drag boxes directly over passwords, account details, or faces to blackout sensitive data.
        </p>

        {/* Upload Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-850 hover:bg-slate-800/50 transition duration-200 rounded-xl p-6 text-center cursor-pointer mb-6"
        >
          <p className="text-sm font-medium text-slate-300">
            {fileName ? `Loaded: ${fileName}` : "Click to select a screenshot/photo"}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Canvas Display */}
        {imageSrc && (
          <div className="space-y-4">
            <p className="text-xs text-indigo-400 font-medium">
              💡 Tip: Click and drag across the image below to draw blackout boxes.
            </p>

            <div className="overflow-auto max-h-[500px] border border-slate-800 rounded-xl bg-slate-950 flex justify-center p-2">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="cursor-crosshair max-w-full h-auto rounded"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearRedactions}
                disabled={rects.length === 0}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                Clear Blackout Boxes ({rects.length})
              </button>

              <button
                onClick={downloadImage}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-medium transition"
              >
                Download Redacted Image
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}