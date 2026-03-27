"use client";

import { HistoryItem } from "@/types";
import { formatTime } from "@/lib/utils";
import { useState, useEffect } from "react";

interface DetailViewProps {
  selectedItem: HistoryItem;
}

export const DetailView = ({ selectedItem }: DetailViewProps) => {
  const [textContent, setTextContent] = useState<string | null>(null);

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
          </div>

          <div className="w-full">
            {selectedItem.type === "image" && selectedItem.url ? (
              <div className="relative group">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-2xl border border-main shadow-2xl transition-transform duration-500"
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
                  <span className="text-[10px] font-bold text-faint uppercase tracking-[0.2em]">Preview</span>
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
