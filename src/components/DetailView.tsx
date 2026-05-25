/* eslint-disable @next/next/no-img-element */
"use client";

import { HistoryItem } from "@/types";
import { useState, useEffect } from "react";

interface DetailViewProps {
  selectedItem: HistoryItem;
  onCopySuccess: (message: string) => void;
}

const dedent = (text: string | null): string => {
  if (!text) return "";
  
  const trimmedText = text.trim();
  const lines = trimmedText.split("\n");
  
  let minIndent = Infinity;
  lines.forEach((line) => {
    if (line.trim().length > 0) {
      const match = line.match(/^(\s*)/);
      if (match) {
        minIndent = Math.min(minIndent, match[1].length);
      }
    }
  });

  if (minIndent === Infinity || minIndent === 0) {
    return trimmedText;
  }

  return lines
    .map((line) => (line.trim().length > 0 ? line.slice(minIndent) : ""))
    .join("\n");
};

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
        if (typeof ClipboardItem !== "undefined") {
          const data = [new ClipboardItem({ [blob.type]: blob })];
          await navigator.clipboard.write(data);
          onCopySuccess("Image copied");
        } else {
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
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-main">
      {/* Header */}
      <div className="px-4 md:px-12 py-4 md:py-6 border-b border-light md:border-b-0 flex items-center justify-between gap-4 shrink-0">
        <h3 className="text-base md:text-xl font-bold text-main truncate select-all">
          {selectedItem.name}
        </h3>

        <button
          onClick={handleCopy}
          disabled={isCopying || (selectedItem.type === "text" && !textContent)}
          className="px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl bg-alt border border-main text-xs md:text-sm font-bold text-main hover:bg-main hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-1.5 md:gap-2 shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
        >
          <svg
            className={`w-3.5 h-3.5 md:w-4 h-4 ${isCopying ? "animate-spin" : ""}`}
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

      {/* Main Preview Display - strictly constrained to fit full height/width without scroll or overflow */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-12 md:pt-0 flex flex-col items-center justify-center">
        {selectedItem.type === "image" && selectedItem.url ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={selectedItem.url}
              alt={selectedItem.name}
              className="max-w-full max-h-full object-contain rounded-2xl border border-main shadow-2xl bg-alt"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col rounded-2xl bg-alt border border-main overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 border-b border-light bg-main flex items-center justify-between shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed text-soft whitespace-pre-wrap break-words selection:bg-accent/20 selection:text-main">
              {dedent(textContent) || "Loading content..."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
