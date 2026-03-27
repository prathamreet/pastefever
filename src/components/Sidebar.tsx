"use client";

import { HistoryItem } from "@/types";
import { formatTime } from "@/lib/utils";

interface SidebarProps {
  history: HistoryItem[];
  stats: {
    totalSize: string;
    imageCount: number;
    textCount: number;
  };
  selectedItem: HistoryItem | null;
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Sidebar = ({
  history,
  stats,
  selectedItem,
  onSelectItem,
  onClearHistory,
  searchQuery,
  onSearchChange,
}: SidebarProps) => {
  return (
    <aside className="w-full border-r border-main bg-alt flex flex-col transition-theme">
      <div className="p-6 border-b border-light space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-main">
            History
          </h2>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-muted hover:text-red-500 transition-colors font-medium cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2 bg-main border border-transparent rounded-xl text-sm text-main placeholder-faint focus:outline-none focus:border-border transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40 h-full">
            <p className="text-xs text-muted">
              {searchQuery ? `No matches for "${searchQuery}"` : "No files yet"}
            </p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.timestamp}
              onClick={() => onSelectItem(item)}
              className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all ${
                selectedItem?.timestamp === item.timestamp
                  ? "bg-main border border-border shadow-sm"
                  : "hover:bg-main/50 border border-transparent"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                item.type === "image" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"
               }`}>
                {item.type === "image" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <div className="text-sm font-bold text-main truncate block mb-0.5">
                  {item.name}
                </div>
                <div className="text-[10px] text-muted font-medium">
                  {formatTime(item.timestamp)}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-light">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>Storage Total</span>
            <span>{stats.totalSize}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>Files In Session</span>
            <span>{history.length}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>Image Blobs</span>
            <span>{stats.imageCount}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>Text Saved</span>
            <span>{stats.textCount}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
