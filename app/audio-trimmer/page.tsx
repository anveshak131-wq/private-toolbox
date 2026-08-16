"use client";

import React, { useState, useRef } from "react";
import { sounds } from "../lib/soundEffects";

export default function AudioTrimmerPage() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [processing, setProcessing] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    setFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const decoded = await ctx.decodeAudioData(arrayBuffer);
    setAudioBuffer(decoded);
    setDuration(decoded.duration);
    setStartTime(0);
    setEndTime(Math.min(15, decoded.duration));
  };

  const playPreview = () => {
    if (!audioBuffer || !audioCtxRef.current) return;
    if (isPlaying) {
      sourceNodeRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtxRef.current.destination);
    source.start(0, startTime, endTime - startTime);
    sourceNodeRef.current = source;
    setIsPlaying(true);

    source.onended = () => setIsPlaying(false);
  };

  const handleExportTrimmedWav = () => {
    if (!audioBuffer) return;
    setProcessing(true);
    sounds.playSuccess();

    const sampleRate = audioBuffer.sampleRate;
    const startOffset = Math.floor(startTime * sampleRate);
    const endOffset = Math.floor(endTime * sampleRate);
    const frameCount = endOffset - startOffset;

    const numOfChannels = audioBuffer.numberOfChannels;
    const trimmedBuffer = new AudioContext().createBuffer(numOfChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const newChannelData = trimmedBuffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        newChannelData[i] = channelData[startOffset + i];
      }
    }

    const wavBlob = bufferToWave(trimmedBuffer, frameCount);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trimmed-${fileName.replace(/\.[^/.]+$/, "")}.wav`;
    a.click();
    setProcessing(false);
  };

  // Convert AudioBuffer into clean WAV format Blob
  function bufferToWave(abuffer: AudioBuffer, len: number) {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels: Float32Array[] = [];
    let pos = 0;

    function setUint16(data: any) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data: any) { view.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    let offset = 0;
    while (offset < len) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">In-Browser Audio Trimmer</h1>
        <p className="text-xs text-slate-400">
          Trim voice notes, podcasts, and MP3/WAV tracks locally with sample-accurate decoding.
        </p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6">
        {!audioBuffer ? (
          <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/40">
            <span className="text-3xl mb-2">🎵</span>
            <span className="text-xs font-bold text-white">Select Audio File (MP3, WAV, AAC)</span>
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white truncate max-w-xs">{fileName}</span>
              <span className="text-xs text-indigo-400 font-mono">Total: {duration.toFixed(1)}s</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Start Time: {startTime.toFixed(1)}s</label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => setStartTime(Math.min(parseFloat(e.target.value), endTime - 0.5))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">End Time: {endTime.toFixed(1)}s</label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => setEndTime(Math.max(parseFloat(e.target.value), startTime + 0.5))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={playPreview}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
              >
                {isPlaying ? "⏹️ Stop Preview" : "▶️ Play Selected Segment"}
              </button>
              <button
                onClick={handleExportTrimmedWav}
                disabled={processing}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20"
              >
                ✂️ Export Trimmed WAV
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}