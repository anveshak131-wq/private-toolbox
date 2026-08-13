"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";

export default function ClientTool() {
  const [text, setText] = useState<string>("https://private-toolbox.pages.dev");
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    generateQr();
  }, [text, fgColor, bgColor]);

  const generateQr = async () => {
    if (!text.trim()) {
      setQrUrl("");
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl mb-12">
      <div className="mb-6">
        <Link href="/" className="text-xs text-indigo-400 hover:underline inline-block">
          ← Back to All Tools
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">📱 Custom QR Code Generator</h1>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
          100% In-Browser
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Generate downloadable custom QR codes for website links, text, or Wi-Fi logins without tracking.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            URL or Text Content
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Foreground Color
            </label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer p-1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Background Color
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer p-1"
            />
          </div>
        </div>
      </div>

      {qrUrl ? (
        <div className="flex flex-col items-center bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
          <img src={qrUrl} alt="Generated QR Code" className="w-48 h-48 rounded-lg shadow-md" />
          <a
            href={qrUrl}
            download="qrcode.png"
            className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            Download PNG QR Code
          </a>
        </div>
      ) : (
        <p className="text-center text-slate-500 text-sm py-4">
          Enter text above to preview your QR code.
        </p>
      )}
    </div>
  );
}