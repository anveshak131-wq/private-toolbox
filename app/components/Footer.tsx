"use client";

import React, { useState } from "react";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const paymentLink = "https://rzp.io/rzp/QwI0dv8P";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    paymentLink
  )}`;

  const handleShare = async () => {
    const shareData = {
      title: "Private Web Utility Toolbox",
      text: "Fast, free, and 100% private web tools. Files never leave your browser!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-8 px-6 mt-auto relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="font-bold text-slate-200 tracking-tight">
              🔒 Private Web Utility Toolbox
            </p>
            <p className="text-slate-500">
              Powered by WebAssembly & Client-Side JavaScript. No file uploads.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* 1. Classic Razorpay Payment Button */}
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-xl font-semibold transition"
            >
              <span>💳</span>
              <span>Classic Payment</span>
            </a>

            {/* 2. Scan UPI QR Modal Trigger */}
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 px-4 py-2 rounded-xl font-semibold transition"
            >
              <span>📱</span>
              <span>Scan UPI QR</span>
            </button>

            {/* 3. Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold transition shadow-md shadow-indigo-600/20"
            >
              <span>🔗</span>
              <span>{copied ? "Link Copied!" : "Share Website"}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* UPI QR Code Modal Popup */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Scan & Pay via UPI</h3>
              <p className="text-slate-400 text-xs">
                Scan using Google Pay, PhonePe, Paytm, or BHIM
              </p>
            </div>

            {/* Generated Razorpay Payment QR Code */}
            <div className="bg-white p-4 rounded-xl inline-block shadow-md">
              <img
                src={qrCodeUrl}
                alt="Razorpay Payment QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-xl transition"
              >
                Or Open Razorpay Web Gateway →
              </a>

              <button
                onClick={() => setShowQrModal(false)}
                className="text-xs text-slate-500 hover:text-slate-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}