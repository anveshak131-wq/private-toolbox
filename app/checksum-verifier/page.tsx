"use client";

import React, { useState } from "react";
import { sounds } from "../lib/soundEffects";

export default function ChecksumVerifierPage() {
  const [hashes, setHashes] = useState<{ sha256: string; sha1: string; sha512: string } | null>(null);
  const [fileName, setFileName] = useState("");
  const [processing, setProcessing] = useState(false);

  const calculateHashes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    sounds.playPop();
    setFileName(file.name);

    const buffer = await file.arrayBuffer();

    const hashBuffer256 = await crypto.subtle.digest("SHA-256", buffer);
    const hashBuffer1 = await crypto.subtle.digest("SHA-1", buffer);
    const hashBuffer512 = await crypto.subtle.digest("SHA-512", buffer);

    const toHex = (buf: ArrayBuffer) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    setHashes({
      sha256: toHex(hashBuffer256),
      sha1: toHex(hashBuffer1),
      sha512: toHex(hashBuffer512),
    });

    sounds.playSuccess();
    setProcessing(false);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">File Checksum & Hash Verifier</h1>
        <p className="text-xs text-slate-400">Compute SHA-256, SHA-512, and SHA-1 checksums locally in browser memory.</p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6">
        <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl block text-center cursor-pointer transition bg-slate-950/40">
          <span className="text-2xl mb-1 block">🛡️</span>
          <span className="text-xs font-bold text-white">Select any file to verify checksum</span>
          <input type="file" onChange={calculateHashes} className="hidden" />
        </label>

        {processing && (
          <div className="text-center text-xs font-bold text-indigo-400 animate-pulse">
            Computing cryptographic hashes...
          </div>
        )}

        {hashes && (
          <div className="space-y-3 font-mono">
            <div className="text-xs font-bold text-white truncate border-b border-slate-800 pb-2">{fileName}</div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">SHA-256</div>
              <div className="text-xs text-emerald-400 break-all select-all">{hashes.sha256}</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">SHA-1</div>
              <div className="text-xs text-slate-300 break-all select-all">{hashes.sha1}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}