"use client";

import React, { useState, useEffect, useRef } from "react";
import { sounds } from "../lib/soundEffects";

interface FileMetadata {
  name: string;
  size: number;
  mimeType: string;
}

export default function ReceivePage() {
  const [status, setStatus] = useState<"connecting" | "receiving" | "completed" | "error">("connecting");
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const chunksRef = useRef<ArrayBuffer[]>([]);
  const receivedBytesRef = useRef<number>(0);

  useEffect(() => {
    const senderId = window.location.hash.slice(1);
    if (!senderId) {
      setStatus("error");
      return;
    }

    let peer: any;
    const connectToSender = async () => {
      const { default: Peer } = await import("peerjs");

      // Mobile Peer
      peer = new Peer({
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      });

      peer.on("open", () => {
        const conn = peer.connect(senderId, { reliable: true });

        conn.on("open", () => {
          sounds.playPop();
          setStatus("receiving");
        });

        conn.on("data", (payload: any) => {
          if (payload.type === "metadata") {
            setMetadata({
              name: payload.name,
              size: payload.size,
              mimeType: payload.mimeType,
            });
            chunksRef.current = [];
            receivedBytesRef.current = 0;
          } else if (payload.type === "chunk") {
            chunksRef.current.push(payload.data);
            receivedBytesRef.current += payload.data.byteLength;
            if (metadata?.size) {
              setProgress(Math.min(100, Math.round((receivedBytesRef.current / metadata.size) * 100)));
            }
          } else if (payload.type === "eof") {
            // Reassemble complete Blob from received array chunks
            const completeBlob = new Blob(chunksRef.current, {
              type: metadata?.mimeType || "application/octet-stream",
            });
            const url = URL.createObjectURL(completeBlob);
            setDownloadUrl(url);
            setStatus("completed");
            sounds.playSuccess();

            // Auto-trigger mobile save
            const a = document.createElement("a");
            a.href = url;
            a.download = metadata?.name || "transferred-file";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        });

        conn.on("error", () => setStatus("error"));
      });

      peer.on("error", () => setStatus("error"));
    };

    connectToSender();

    return () => {
      if (peer) peer.destroy();
    };
  }, [metadata?.size]);

  return (
    <main className="max-w-md mx-auto px-6 py-16 space-y-8 text-center min-h-[75vh] flex flex-col justify-center">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-black text-white">Direct P2P AirDrop Receiver</h1>
          <p className="text-xs text-slate-400 mt-1">In-memory transfer directly from sender computer</p>
        </div>

        {status === "connecting" && (
          <div className="py-6 space-y-2">
            <div className="text-xs font-mono text-indigo-400 animate-pulse">
              Pairing WebRTC Data Channel...
            </div>
            <p className="text-[11px] text-slate-500">Keep this screen open while negotiating connection</p>
          </div>
        )}

        {status === "receiving" && (
          <div className="space-y-4 py-4">
            <div className="text-xs font-bold text-white truncate">{metadata?.name || "Streaming payload..."}</div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-600 h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs font-mono text-indigo-400">{progress}% received</div>
          </div>
        )}

        {status === "completed" && (
          <div className="space-y-4 py-4">
            <div className="text-sm font-bold text-emerald-400">File Received Successfully!</div>
            <p className="text-xs text-slate-400">{metadata?.name}</p>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={metadata?.name || "transferred-file"}
                className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
              >
                ⬇️ Tap to Re-Download
              </a>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="space-y-2 py-4">
            <div className="text-sm font-bold text-rose-400">Connection Expired or Failed</div>
            <p className="text-xs text-slate-400">Please re-scan the QR code from the sender window.</p>
          </div>
        )}
      </div>
    </main>
  );
}