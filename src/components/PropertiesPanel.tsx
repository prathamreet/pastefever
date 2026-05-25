"use client";

import { useState } from "react";
import { HistoryItem } from "@/types";
import { formatTime } from "@/lib/utils";

interface PropertiesPanelProps {
  selectedItem: HistoryItem;
  onRedownload: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
}

export const PropertiesPanel = ({
  selectedItem,
  onRedownload,
  onDelete,
}: PropertiesPanelProps) => {
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);

  return (
    <aside className="w-full h-fit shrink-0 md:h-full md:w-80 border-t md:border-t-0 md:border-l border-main bg-alt flex flex-col transition-all duration-300">
      {/* <div className="p-6 border-b border-light flex items-center h-16">
        <h3 className="text-sm font-bold text-main">
          Details
        </h3>
      </div> */}

      <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 ${showDetailsMobile ? "block" : "hidden md:block"}`}>
        <section>
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">File Name</span>
              <p className="text-sm font-bold text-main break-all">{selectedItem.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Format</span>
                <p className="text-sm font-bold text-main">{(selectedItem.extension || "").toUpperCase()}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Size</span>
                <p className="text-sm font-bold text-main">{selectedItem.size}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-[10px] font-bold text-faint uppercase tracking-widest border-b border-light pb-2">Technical Stats</h4>
          <div className="space-y-3">
            {selectedItem.type === "image" ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Dimensions</span>
                  <span className="text-xs font-bold text-main">{selectedItem.width} × {selectedItem.height}px</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Aspect Ratio</span>
                  <span className="text-xs font-bold text-main">
                    {(selectedItem.width! / selectedItem.height!).toFixed(2)}:1
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Lines</span>
                  <span className="text-xs font-bold text-main">{selectedItem.lines}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Characters</span>
                  <span className="text-xs font-bold text-main">{selectedItem.characters}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-muted">Added</span>
              <span className="text-xs font-bold text-main">
                {formatTime(selectedItem.timestamp)}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 md:p-6 border-t border-light bg-main/30 space-y-2 md:space-y-3">
        <button
          onClick={() => setShowDetailsMobile(!showDetailsMobile)}
          className="md:hidden w-full py-2.5 bg-main border border-border text-main hover:bg-border/30 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showDetailsMobile ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            )}
          </svg>
          {showDetailsMobile ? "Hide Details" : "Show Details"}
        </button>
        <button
          onClick={() => onRedownload(selectedItem)}
          className="w-full py-2.5 md:py-3 bg-accent text-[var(--bg-alt)] hover:bg-soft text-xs md:text-sm font-semibold rounded-xl transition-all shadow-md shadow-accent/10 active:scale-[0.98] cursor-pointer"
        >
          Download File
        </button>
        <button
          onClick={() => onDelete(selectedItem)}
          className="w-full py-2.5 md:py-3 bg-main border border-border text-main hover:bg-border/30 text-xs md:text-sm font-semibold rounded-xl transition-all active:scale-[0.98] cursor-pointer text-center"
        >
          Delete Item
        </button>
      </div>
    </aside>
  );
};
