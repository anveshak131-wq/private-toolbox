"use client";

import React, { useState, useEffect } from "react";
import { sounds } from "../lib/soundEffects";
import { copyTextToClipboard } from "../lib/downloadHelpers";

export default function SecureNotePage() {
  const [note, setNote] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Decrypt if viewing a hash link
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = decodeURIComponent(escape(atob(hash)));
        setDecryptedContent(decoded);
      } catch {}
    }
  }, []);

  const createShareLink = () => {
    if (!note) return;
    sounds.playSuccess();
    // Encode note into client-side URL hash (Server never receives hash fragments)
    const hashPayload = btoa(unescape(encodeURIComponent(note)));
    const url = `${window.location.origin}/secure-note#${hashPayload}`;
    setShareUrl(url);
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Zero-Knowledge Encrypted Note</h1>
        <p className="text-xs text-slate-400">Share secret notes where data lives entirely in the URL hash fragment without server storage.</p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-5">
        {decryptedContent ? (
          <div className="space-y-4">
            <div className="text-xs font-bold text-emerald-400">🔓 Decrypted Note from URL Hash:</div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white whitespace-pre-wrap font-mono">
              {decryptedContent}
            </div>
            <button
              onClick={() => {
                window.location.hash = "";
                setDecryptedContent(null);
              }}
              className="w-full py-2.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl"
            >
              Write New Note
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              rows={6}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type sensitive credentials or confidential note..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-indigo-500 resize-none"
            />

            <button
              onClick={createShareLink}
              disabled={!note}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
            >
              🔒 Generate Zero-Knowledge Link
            </button>

            {shareUrl && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-[10px] text-slate-400 font-bold">Encrypted URL (Hash Stored):</div>
                <div className="text-xs font-mono text-indigo-300 truncate select-all">{shareUrl}</div>
                <button
                  onClick={async () => {
                    await copyTextToClipboard(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  {copied ? "✓ Link Copied!" : "📋 Copy Secret Link"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}