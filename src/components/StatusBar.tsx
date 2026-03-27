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
    <div className="border-t border-main bg-alt px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isProcessing ? "bg-blue-500 animate-pulse" : "bg-green-500"
          }`}
        ></div>
        <span className="text-xs text-muted">{statusText}</span>
      </div>

      {selectedItem && (
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>Type: {selectedItem.extension}</span>
          <span>Size: {selectedItem.size}</span>
          {selectedItem.type === "image" && selectedItem.width && (
            <span>
              Dimensions: {selectedItem.width}×{selectedItem.height}px
            </span>
          )}
        </div>
      )}
    </div>
  );
};
