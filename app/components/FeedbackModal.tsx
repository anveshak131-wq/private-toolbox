"use client";

import React, { useState } from "react";
import { submitUserFeedback } from "../lib/analytics";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = useState<"feature" | "bug" | "feedback">("feature");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    await submitUserFeedback(type, message.trim(), window.location.pathname, contact.trim());
    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setMessage("");
      setContact("");
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <h3 className="text-base font-bold text-white">Send Feedback & Requests</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="text-3xl">✨</div>
            <p className="text-sm font-bold text-emerald-400">Thank you for your feedback!</p>
            <p className="text-xs text-slate-400">Your message has been delivered to the admin inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              {[
                { id: "feature", label: "💡 Request Tool" },
                { id: "bug", label: "🐛 Report Bug" },
                { id: "feedback", label: "💬 General" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as any)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                    type === item.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {type === "feature" ? "What tool or utility should we add?" : "Describe your feedback or issue:"}
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === "feature"
                    ? "e.g., An audio trim tool or bulk WebP converter..."
                    : "e.g., Found an issue when uploading large files..."
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white resize-none outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Email or Telegram handle (Optional)</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Optional for updates"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition"
            >
              {isSubmitting ? "Sending..." : "Submit to Creator"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}