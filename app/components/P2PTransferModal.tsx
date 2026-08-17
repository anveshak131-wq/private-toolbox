"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import type { DataConnection } from "peerjs";
import { sounds } from "../lib/soundEffects";

interface P2PTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileBlob: Blob | null;
  fileName: string;
}

export default function P2PTransferModal({
  isOpen,
  onClose,
  fileBlob,
  fileName,
}: P2PTransferModalProps) {
  const [peerId, setPeerId] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<"waiting" | "connected" | "transferring" | "completed">("waiting");
  const [transferProgress, setTransferProgress] = useState<number>(0);
  const peerInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || !fileBlob) return;

    let peer: any;
    const initPeer = async () => {
      // Dynamic import to support SSR static exports
      const { default: Peer } = await import("peerjs");

      // Generate a short 6-character random room ID
      const randomId = "pt-" + Math.random().toString(36).substring(2, 8);
      peer = new Peer(randomId, {
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      });

      peerInstanceRef.current = peer;

      peer.on("open", async (id: string) => {
        setPeerId(id);
        const transferUrl = `${window.location.origin}/receive#${id}`;
        try {
          const qrCodeUrl = await QRCode.toDataURL(transferUrl, {
            width: 260,
            margin: 2,
            color: { dark: "#ffffff", light: "#020617" },
          });
          setQrDataUrl(qrCodeUrl);
        } catch (err) {
          console.error("QR Code Generation failed", err);
        }
      });

      peer.on("connection", (conn: DataConnection) => {
        setConnectionStatus("connected");
        sounds.playPop();

        conn.on("open", () => {
          setConnectionStatus("transferring");

          // Send file metadata first
          conn.send({
            type: "metadata",
            name: fileName,
            size: fileBlob.size,
            mimeType: fileBlob.type || "application/octet-stream",
          });

          // Stream binary file in 32KB chunks
          const CHUNK_SIZE = 32 * 1024;
          fileBlob.arrayBuffer().then((buffer) => {
            const totalBytes = buffer.byteLength;
            let offset = 0;

            const sendNextChunk = () => {
              if (offset < totalBytes) {
                const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
                conn.send({ type: "chunk", data: chunk });
                offset += CHUNK_SIZE;
                setTransferProgress(Math.min(100, Math.round((offset / totalBytes) * 100)));
                setTimeout(sendNextChunk, 10); // Small interval to prevent channel buffer overflow
              } else {
                conn.send({ type: "eof" });
                setConnectionStatus("completed");
                sounds.playSuccess();
              }
            };

            sendNextChunk();
          });
        });
      });
    };

    initPeer();

    return () => {
      if (peerInstanceRef.current) {
        peerInstanceRef.current.destroy();
      }
    };
  }, [isOpen, fileBlob, fileName]);

  if (!isOpen || !fileBlob) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-center">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <h3 className="text-sm font-bold text-white">Direct P2P Device Transfer</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold text-white truncate max-w-xs mx-auto">{fileName}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            {(fileBlob.size / 1024).toFixed(1)} KB • Direct WebRTC Stream (0 Server Storage)
          </div>
        </div>

        {/* QR Code Container */}
        {connectionStatus === "waiting" && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 inline-block mx-auto shadow-inner">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Pairing QR Code" className="w-52 h-52 mx-auto rounded-xl" />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-indigo-400 font-mono animate-pulse">
                  Establishing P2P Channel...
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Scan with your phone's camera or QR reader to connect devices and receive the file instantly.
            </p>
          </div>
        )}

        {/* Live Transferring Indicator */}
        {connectionStatus === "transferring" && (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto animate-bounce">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-bold text-white">Streaming File to Phone...</div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-indigo-600 h-full transition-all duration-150"
                  style={{ width: `${transferProgress}%` }}
                />
              </div>
              <div className="text-xs font-mono text-indigo-400">{transferProgress}%</div>
            </div>
          </div>
        )}

        {/* Transfer Complete */}
        {connectionStatus === "completed" && (
          <div className="py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="text-sm font-bold text-emerald-400">Transfer Complete!</div>
            <p className="text-xs text-slate-400">The file was delivered directly to your mobile device.</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}