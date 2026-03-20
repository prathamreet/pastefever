"use client";

import { useState, useEffect, useRef } from "react";

interface HistoryItem {
  url: string;
  name: string;
  size: string;
  sizeBytes: number;
  type: "image" | "text";
  timestamp: number;
  // Image specific
  width?: number;
  height?: number;
  extension?: string;
  // Text specific
  characters?: number;
  lines?: number;
  words?: number;
}

export default function PasteFever() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [status, setStatusText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Initialize theme
  useEffect(() => {
    const initTheme = () => {
      const saved = localStorage.getItem("pf-theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const theme = saved || (prefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
      setCurrentTheme(theme as "light" | "dark");
    };

    const saved = localStorage.getItem("pf-history");
    if (saved) {
      const loadedHistory = JSON.parse(saved);
      setHistory(loadedHistory);
    }

    initTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("pf-theme")) {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        setCurrentTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let item of items) {
        if (item.type.includes("image")) {
          const file = item.getAsFile();
          if (file) processImage(file);
          return;
        }
      }

      for (let item of items) {
        if (item.type === "text/plain") {
          item.getAsString(processText);
          return;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [history]);

  const processImage = (blob: Blob) => {
    setStatusText("Processing image...");
    setIsProcessing(true);

    const url = URL.createObjectURL(blob);
    const ext = blob.type.split("/")[1] || "png";
    const name = `pastefever-${Date.now()}.${ext}`;
    const sizeBytes = blob.size;

    const img = new Image();
    img.onload = () => {
      const item: HistoryItem = {
        url,
        name,
        size: formatBytes(sizeBytes),
        sizeBytes,
        type: "image",
        timestamp: Date.now(),
        width: img.width,
        height: img.height,
        extension: ext.toUpperCase(),
      };
      complete(item);
    };
    img.src = url;
  };

  const processText = (text: string) => {
    if (!text?.trim()) return;

    setStatusText("Processing text...");
    setIsProcessing(true);

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const name = `pastefever-${Date.now()}.txt`;
    const sizeBytes = blob.size;

    const lines = text.split("\n").length;
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;

    const item: HistoryItem = {
      url,
      name,
      size: formatBytes(sizeBytes),
      sizeBytes,
      type: "text",
      timestamp: Date.now(),
      characters,
      lines,
      words,
      extension: "TXT",
    };

    complete(item);
  };

  const complete = (data: HistoryItem) => {
    // Download
    const a = document.createElement("a");
    a.href = data.url;
    a.download = data.name;
    a.click();

    // Update history
    const newHistory = [data, ...history].slice(0, 100);
    setHistory(newHistory);
    localStorage.setItem("pf-history", JSON.stringify(newHistory));

    // UI feedback
    setStatusText("");
    setIsProcessing(false);
    showToastMessage("Downloaded successfully");
  };

  const redownload = (data: HistoryItem) => {
    const a = document.createElement("a");
    a.href = data.url;
    a.download = data.name;
    a.click();
    showToastMessage("Downloaded");
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const toggleTheme = () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pf-theme", next);
    setCurrentTheme(next);
  };

  const clearHistory = () => {
    if (!confirm("Clear all history?")) return;
    setHistory([]);
    setSelectedItem(null);
    localStorage.removeItem("pf-history");
  };

  const stats = (() => {
    const totalSize = history.reduce((acc, item) => acc + item.sizeBytes, 0);
    const imageCount = history.filter((item) => item.type === "image").length;
    const textCount = history.filter((item) => item.type === "text").length;
    return { totalSize: formatBytes(totalSize), imageCount, textCount };
  })();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-main">
      {/* Header */}
      <header className="border-b border-main bg-alt transition-all duration-300">
        <div className="flex items-center justify-between px-6 h-18">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-main">PasteFever</h1>
             
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-sm text-muted">
              <span>items </span>
              <span className="text-main font-medium">{history.length}</span>
              <div className="w-px h-3 bg-border mx-3"></div>
              <span>size </span>
              <span className="text-main font-medium">{stats.totalSize}</span>
              <div className="w-px h-3 bg-border mx-3"></div>
              <span>image</span>
              <span className="text-blue-500 font-medium">
                {stats.imageCount}
              </span>
              <div className="w-px h-3 bg-border mx-3"></div>
              <span>text</span>
              <span className="text-green-500 font-medium">
                {stats.textCount}
              </span>
            </div>

            <div className="w-px h-3 bg-border mx-3"></div>
            <a
              href="https://github.com/prathamreet/pastefever"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl hover:bg-main transition-all duration-300 hover:scale-105 flex items-center justify-center group cursor-pointer text-muted hover:text-soft"
              title="View on GitHub"
            >
              <svg className="w-5 h-5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-xl hover:bg-main transition-all duration-300 hover:scale-105 flex items-center justify-center group cursor-pointer"
              title={`Switch to ${
                currentTheme === "dark" ? "light" : "dark"
              } theme`}
            >
              <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <svg
                  className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 transform ${
                    currentTheme === "dark"
                      ? "opacity-0 rotate-90 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>

                {/* Moon Icon */}
                <svg
                  className={`absolute inset-0 w-5 h-5 text-slate-400 transition-all duration-500 transform ${
                    currentTheme === "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>

              {/* Hover effect ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/20 to-soft/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-main bg-alt flex flex-col transition-theme">
          <div className="p-4 border-b border-light">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium text-soft mt-4 uppercase tracking-wide">
                History
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
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
                <p className="text-sm text-main font-medium mb-1">
                  No files yet
                </p>
                <p className="text-xs text-muted">
                  Paste content to get started
                </p>
              </div>
            ) : (
              <div className="p-2">
                {history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedItem(item)}
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
                          {item.type === "image" &&
                            item.width &&
                            item.height && (
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

        {/* Main Content */}
        <main className="flex-1 flex transition-theme">
          {/* Center Area */}
          <div className="flex-1 flex flex-col">
            {selectedItem ? (
              // Detail View
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-2xl">
                    {selectedItem.type === "image" && selectedItem.url ? (
                      <div className="mb-6">
                        <img
                          src={selectedItem.url}
                          alt={selectedItem.name}
                          className="max-h-96 mx-auto rounded-lg border border-main shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="w-32 h-32 mx-auto rounded-2xl bg-alt border border-main flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    <h3 className="text-lg font-medium text-main mb-2">
                      {selectedItem.name}
                    </h3>
                    <p className="text-sm text-muted mb-6">
                      Added {formatTime(selectedItem.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-alt border border-main flex items-center justify-center mb-6">
                    <svg
                      className="w-7 h-7 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-xl font-medium text-main mb-2">
                    {isProcessing ? "Processing..." : "Paste to Download"}
                  </h2>

                  <p className="text-sm text-muted mb-8">
                    Paste any image or text to instantly download it. Everything
                    stays on your device.
                  </p>

                  <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-alt border border-main">
                    <kbd className="px-3 py-1.5 text-xs font-medium text-soft bg-main rounded border border-border">
                      Ctrl
                    </kbd>
                    <span className="text-xs text-muted">+</span>
                    <kbd className="px-3 py-1.5 text-xs font-medium text-soft bg-main rounded border border-border">
                      V
                    </kbd>
                  </div>

                  <div className="mt-8 pt-8 border-t border-light">
                    <p className="text-xs text-muted mb-3">Supported formats</p>
                    <div className="flex items-center justify-center gap-2">
                      {["PNG", "JPG", "GIF", "WEBP", "TXT"].map((format) => (
                        <span
                          key={format}
                          className="px-2 py-1 text-[10px] font-medium text-muted bg-main rounded border border-border"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Bar */}
            {(isProcessing || status) && (
              <div className="border-t border-main bg-alt px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isProcessing
                        ? "bg-blue-500 animate-pulse"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-xs text-muted">{status}</span>
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
            )}
          </div>

          {/* Stats Panel */}
          {selectedItem && (
            <aside className="w-72 border-l border-main bg-alt p-6 overflow-y-auto">
              <h3 className="text-xs font-medium text-soft uppercase tracking-wide mb-4">
                Properties
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted block mb-1">
                    File name
                  </label>
                  <p className="text-sm text-main font-medium break-all">
                    {selectedItem.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted block mb-1">
                      Type
                    </label>
                    <p className="text-sm text-main font-medium">
                      {selectedItem.extension}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">
                      Size
                    </label>
                    <p className="text-sm text-main font-medium">
                      {selectedItem.size}
                    </p>
                  </div>
                </div>

                {selectedItem.type === "image" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted block mb-1">
                          Width
                        </label>
                        <p className="text-sm text-main font-medium">
                          {selectedItem.width}px
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-muted block mb-1">
                          Height
                        </label>
                        <p className="text-sm text-main font-medium">
                          {selectedItem.height}px
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted block mb-1">
                        Resolution
                      </label>
                      <p className="text-sm text-main font-medium">
                        {selectedItem.width && selectedItem.height
                          ? `${selectedItem.width} × ${selectedItem.height}px`
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs text-muted block mb-1">
                        Aspect Ratio
                      </label>
                      <p className="text-sm text-main font-medium">
                        {selectedItem.width && selectedItem.height
                          ? `${(
                              selectedItem.width / selectedItem.height
                            ).toFixed(2)}:1`
                          : "N/A"}
                      </p>
                    </div>
                  </>
                )}

                {selectedItem.type === "text" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted block mb-1">
                          Characters
                        </label>
                        <p className="text-sm text-main font-medium">
                          {selectedItem.characters?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-muted block mb-1">
                          Words
                        </label>
                        <p className="text-sm text-main font-medium">
                          {selectedItem.words?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted block mb-1">
                        Lines
                      </label>
                      <p className="text-sm text-main font-medium">
                        {selectedItem.lines?.toLocaleString()}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs text-muted block mb-1">
                    Created
                  </label>
                  <p className="text-sm text-main font-medium">
                    {new Date(selectedItem.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="pt-4 border-t border-light">
                  <button
                    onClick={() => redownload(selectedItem)}
                    className="w-full px-4 py-2 bg-accent hover:bg-soft text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            </aside>
          )}
        </main>
      </div>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg border border-main bg-alt shadow-lg transition-all duration-300 ${
          showToast
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm text-main">{toastMessage}</span>
        </div>
      </div>
    </div>
  );
}
