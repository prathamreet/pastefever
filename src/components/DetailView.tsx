"use client";

import { HistoryItem } from "@/types";
import { formatTime } from "@/lib/utils";
import { useState, useEffect } from "react";

interface DetailViewProps {
  selectedItem: HistoryItem;
  onCopySuccess: (message: string) => void;
}

export const DetailView = ({ selectedItem, onCopySuccess }: DetailViewProps) => {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    if (selectedItem.type === "text" && selectedItem.url) {
      fetch(selectedItem.url)
        .then((res) => res.text())
        .then((text) => setTextContent(text))
        .catch(() => setTextContent("Error loading preview"));
    } else {
      setTextContent(null);
    }
  }, [selectedItem]);

  const handleCopy = async () => {
    if (!selectedItem.url) return;
    setIsCopying(true);

    try {
      if (selectedItem.type === "image") {
        const response = await fetch(selectedItem.url);
        const blob = await response.blob();
        // Check if clipboard supports image/type
        if (typeof ClipboardItem !== "undefined") {
          const data = [new ClipboardItem({ [blob.type]: blob })];
          await navigator.clipboard.write(data);
          onCopySuccess("Image copied");
        } else {
          // Fallback or error
          onCopySuccess("Clipboard not supported");
        }
      } else if (textContent) {
        await navigator.clipboard.writeText(textContent);
        onCopySuccess("Text copied");
      }
    } catch (err) {
      console.error("Copy failed", err);
      onCopySuccess("Copy failed");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-main">
      <div className="flex-1 overflow-auto p-8 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-main truncate mb-1">
                {selectedItem.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted font-medium uppercase tracking-tight">
                <span className="text-accent">{selectedItem.extension}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                <span>{selectedItem.size}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                <span>{formatTime(selectedItem.timestamp)}</span>
              </div>
            </div>

            <button
              onClick={handleCopy}
              disabled={isCopying || (selectedItem.type === "text" && !textContent)}
              className="px-5 py-2.5 rounded-xl bg-alt border border-main text-sm font-bold text-main hover:bg-main hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <svg
                className={`w-4 h-4 ${isCopying ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isCopying ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m0 0H15"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                )}
              </svg>
              {isCopying ? "COPYING..." : "COPY"}
            </button>
          </div>

          <div className="w-full">
            {selectedItem.type === "image" && selectedItem.url ? (
              <div className="relative group">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-2xl border border-main shadow-2xl"
                />
              </div>
            ) : (
              <div className="w-full rounded-2xl bg-alt border border-main overflow-hidden shadow-2xl">
                <div className="px-4 py-2.5 border-b border-light bg-main flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
                  </div>
                  <span className="text-[10px] font-bold text-faint uppercase tracking-[0.2em]">
                    Preview
                  </span>
                </div>
                <div className="p-6 md:p-10 font-mono text-sm leading-relaxed text-soft overflow-x-auto whitespace-pre selection:bg-accent/20 selection:text-main">
                  {textContent || "Loading content..."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
