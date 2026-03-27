"use client";

import { HistoryItem } from "@/types";

interface StatusBarProps {
  isProcessing: boolean;
  statusText: string;
  selectedItem: HistoryItem | null;
}

export const StatusBar = ({
  isProcessing,
  statusText,
  selectedItem,
}: StatusBarProps) => {
  if (!isProcessing && !statusText) return null;

  return (
    <div className="border-t border-main bg-alt px-6 h-10 flex items-center justify-between z-10 transition-theme overflow-hidden">
      <div className="flex items-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isProcessing ? "bg-blue-500 animate-pulse" : "bg-green-500"
          }`}
        ></div>
        <span className="text-xs font-bold text-muted uppercase tracking-wider">
          {isProcessing ? "Processing..." : statusText || "System Ready"}
        </span>
      </div>

      {selectedItem && (
        <div className="flex items-center gap-4 text-xs font-bold text-muted uppercase tracking-tight">
          <div className="flex items-center gap-1.5">
            <span className="opacity-50 font-medium lowercase">type:</span>
            <span className="text-main">{selectedItem.extension}</span>
          </div>
          <div className="w-px h-2.5 bg-border"></div>
          <div className="flex items-center gap-1.5">
            <span className="opacity-50 font-medium lowercase">size:</span>
            <span className="text-main">{selectedItem.size}</span>
          </div>
          {selectedItem.type === "image" && (
            <>
              <div className="w-px h-2.5 bg-border"></div>
              <div className="flex items-center gap-1.5">
                <span className="opacity-50 font-medium lowercase">res:</span>
                <span className="text-main">
                  {selectedItem.width}×{selectedItem.height}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
