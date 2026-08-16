"use client";

import React, { useState, useEffect, useCallback } from "react";
import { sounds } from "../lib/soundEffects";
import { copyTextToClipboard } from "../lib/downloadHelpers";

const WORD_LIST = [
  "falcon", "orbit", "quantum", "crystal", "matrix", "beacon", "timber", "aurora",
  "shadow", "summit", "canyon", "velvet", "horizon", "cipher", "glacier", "nebula",
  "cobalt", "voyager", "zenith", "cascade", "radiant", "obsidian", "pulsar", "solstice"
];

export default function PasswordGeneratorPage() {
  const [type, setType] = useState<"password" | "passphrase">("password");
  const [length, setLength] = useState(18);
  const [wordCount, setWordCount] = useState(4);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    sounds.playPop();
    if (type === "password") {
      let chars = "abcdefghijklmnopqrstuvwxyz";
      if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (includeNumbers) chars += "0123456789";
      if (includeSymbols) chars += "!@#$%^&*()-_=+[]{}|;:,.<>?";

      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      let pass = "";
      for (let i = 0; i < length; i++) {
        pass += chars[arr[i] % chars.length];
      }
      setResult(pass);
    } else {
      const arr = new Uint32Array(wordCount);
      crypto.getRandomValues(arr);
      const words = Array.from(arr).map((val) => WORD_LIST[val % WORD_LIST.length]);
      setResult(words.join("-"));
    }
  }, [type, length, wordCount, includeUpper, includeNumbers, includeSymbols]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = async () => {
    sounds.playSuccess();
    const ok = await copyTextToClipboard(result);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Secure Password Generator</h1>
        <p className="text-xs text-slate-400">
          Cryptographically random passwords generated locally with window.crypto.
        </p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
          <span className="font-mono text-sm sm:text-base font-bold text-indigo-300 break-all select-all">
            {result}
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shrink-0"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setType("password")}
            className={`py-1.5 rounded-lg text-xs font-bold transition ${
              type === "password" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            Random Characters
          </button>
          <button
            onClick={() => setType("passphrase")}
            className={`py-1.5 rounded-lg text-xs font-bold transition ${
              type === "passphrase" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            Memorable Passphrase
          </button>
        </div>

        {type === "password" ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Length: {length}</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600"
                />
                <span>Uppercase</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600"
                />
                <span>Numbers</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600"
                />
                <span>Symbols</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Word Count: {wordCount}</span>
            </div>
            <input
              type="range"
              min="3"
              max="8"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        )}

        <button
          onClick={generate}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition"
        >
          🔄 Regenerate New Secret
        </button>
      </div>
    </main>
  );
}