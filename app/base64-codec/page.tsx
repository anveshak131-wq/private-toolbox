"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import Link from "next/link";

export default function Base64CodecPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const encodeText = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError(null);
    } catch (e: any) {
      setError("Failed to encode text.");
    }
  };

  const decodeText = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
      setError(null);
    } catch (e: any) {
      setError("Invalid Base64 string.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setOutput(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link href="/" className="text-xs text-indigo-400 hover:underline">← Back to Tools</Link>
        <h1 className="text-2xl font-bold text-white mt-1">Base64 Encoder & Decoder</h1>
        <p className="text-xs text-slate-400">Convert plain text or binary media to and from Base64 representations.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <button onClick={encodeText} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">Encode to Base64</button>
        <button onClick={decodeText} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold">Decode from Base64</button>
        <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700">
          Encode Any File to Base64
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text or base64 string here..."
          className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 resize-none outline-none focus:border-indigo-500"
        />
        <div className="relative">
          <textarea
            readOnly
            value={output}
            placeholder="Result will appear here..."
            className="w-full h-full p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs font-mono text-emerald-400 resize-none outline-none"
          />
          {output && (
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700"
            >
              Copy
            </button>
          )}
        </div>
      </div>
    </main>
  );
}