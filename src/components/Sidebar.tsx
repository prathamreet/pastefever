"use client";

import { HistoryItem } from "@/types";
import { formatTime } from "@/lib/utils";

interface SidebarProps {
  history: HistoryItem[];
  selectedItem: HistoryItem | null;
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const Sidebar = ({
  history,
  selectedItem,
  onSelectItem,
  onClearHistory,
}: SidebarProps) => {
  return (
    <aside className="w-80 border-r border-main bg-alt flex flex-col transition-theme">
      <div className="p-4 border-b border-light">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-medium text-soft mt-4 uppercase tracking-wide">
            History
          </h2>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-muted hover:text-soft transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-8 text-center">
            <p className="text-sm text-main font-medium mb-1">No files yet</p>
            <p className="text-xs text-muted">Paste content to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => onSelectItem(item)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-all group ${
                  selectedItem === item
                    ? "bg-main border border-border"
                    : "hover:bg-main border border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.type === "image"
                        ? "bg-blue-500/10"
                        : "bg-green-500/10"
                    }`}
                  >
                    {item.type === "image" ? (
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-main truncate pr-2">
                        {item.name}
                      </p>
                      <span className="text-[10px] text-faint flex-shrink-0">
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <span className="px-1.5 py-0.5 rounded bg-main">
                        {item.extension}
                      </span>
                      <span>{item.size}</span>
                      {item.type === "image" && item.width && item.height && (
                        <span>
                          {item.width}×{item.height}
                        </span>
                      )}
                      {item.type === "text" && item.characters && (
                        <span>{item.characters} chars</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
