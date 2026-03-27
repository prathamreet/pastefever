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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* File Label & Metadata */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-main tracking-tight mb-2">
              {selectedItem.name}
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-muted">
              <span className="px-2 py-0.5 rounded-full bg-accent/5 text-accent border border-accent/20 font-medium lowercase">
                {selectedItem.extension}
              </span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span>Added {formatTime(selectedItem.timestamp)}</span>
            </div>
          </div>

          {/* Preview Area */}
          <div className="w-full">
            {selectedItem.type === "image" && selectedItem.url ? (
              <div className="relative group cursor-zoom-in">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-2xl border border-main shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
              </div>
            ) : (
              <div className="w-full rounded-2xl bg-alt border border-main overflow-hidden shadow-2xl">
                <div className="px-4 py-2 border-b border-light bg-main/30 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-faint font-bold">Preview</span>
                </div>
                <div className="p-6 md:p-8 font-mono text-sm leading-relaxed text-soft overflow-x-auto whitespace-pre">
                  {textContent || "Loading preview..."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
