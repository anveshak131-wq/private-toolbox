"use client";

import React, { useState } from "react";
import { sounds } from "../lib/soundEffects";

export default function FileEncryptorPage() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Key Derivation using PBKDF2 (100,000 iterations)
  const deriveKey = async (pass: string, salt: Uint8Array) => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt as BufferSource, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const handleProcess = async () => {
    if (!file || !password) return;
    setProcessing(true);
    setStatusMsg(null);
    sounds.playPop();

    try {
      const fileBuffer = await file.arrayBuffer();

      if (mode === "encrypt") {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);

        const encryptedContent = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          key,
          fileBuffer
        );

        // Combine Salt (16B) + IV (12B) + Encrypted Data
        const combined = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
        combined.set(salt, 0);
        combined.set(iv, 16);
        combined.set(new Uint8Array(encryptedContent), 28);

        const blob = new Blob([combined], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name}.enc`;
        a.click();
        sounds.playSuccess();
        setStatusMsg("✓ File encrypted with military-grade AES-256-GCM.");
      } else {
        // Decrypt
        const data = new Uint8Array(fileBuffer);
        if (data.length < 28) throw new Error("Invalid encrypted file package");

        const salt = data.slice(0, 16);
        const iv = data.slice(16, 28);
        const encryptedData = data.slice(28);

        const key = await deriveKey(password, salt);
        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          key,
          encryptedData
        );

        const outName = file.name.endsWith(".enc") ? file.name.replace(".enc", "") : `decrypted-${file.name}`;
        const blob = new Blob([decryptedBuffer]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = outName;
        a.click();
        sounds.playSuccess();
        setStatusMsg("✓ File decrypted and saved successfully.");
      }
    } catch {
      setStatusMsg("❌ Operation failed. Incorrect password or corrupted payload.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Client-Side File Encryptor</h1>
        <p className="text-xs text-slate-400">
          Encrypt and decrypt files using AES-256-GCM with PBKDF2 key derivation directly in your browser.
        </p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-5">
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setMode("encrypt")}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === "encrypt" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            🔒 Encrypt File
          </button>
          <button
            onClick={() => setMode("decrypt")}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === "decrypt" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            🔓 Decrypt File
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">1. Select Target File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">2. Encryption Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter strong encryption secret..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleProcess}
          disabled={!file || !password || processing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
        >
          {processing ? "Processing WebCrypto Key..." : mode === "encrypt" ? "Encrypt & Download .enc" : "Decrypt & Download"}
        </button>

        {statusMsg && (
          <div className="text-center text-xs font-semibold text-slate-300 pt-2">{statusMsg}</div>
        )}
      </div>
    </main>
  );
}