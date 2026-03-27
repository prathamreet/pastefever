"use client";

import { useState, useEffect } from "react";
import { HistoryItem } from "@/types";
import { formatBytes } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DetailView } from "@/components/DetailView";
import { EmptyState } from "@/components/EmptyState";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { StatusBar } from "@/components/StatusBar";
import { Toast } from "@/components/Toast";
import { NameModal } from "@/components/NameModal";
import { saveFile, getFile, clearAllFiles } from "@/lib/db";

export default function PasteFever() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [statusText, setStatusText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const filteredHistory = history.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.extension || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal state
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<HistoryItem | null>(null);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);

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

    const loadAndHydrateHistory = async () => {
      const saved = localStorage.getItem("pf-history");
      if (!saved) return;

      const loadedHistory: HistoryItem[] = JSON.parse(saved);

      // Hydrate blobs from IndexedDB
      const hydratedHistory = await Promise.all(
        loadedHistory.map(async (item) => {
          try {
            const blob = await getFile(item.timestamp);
            if (blob) {
              return { ...item, url: URL.createObjectURL(blob) };
            }
          } catch (e) {
            console.error("Hydration failed for", item.name, e);
          }
          return item; // Fallback to original
        })
      );

      setHistory(hydratedHistory);
    };

    loadAndHydrateHistory();
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
      // Don't handle paste if modal is already open
      if (isNameModalOpen) return;

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
  }, [history, isNameModalOpen]);

  // Escape key for deselection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isNameModalOpen) {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNameModalOpen]);

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
      complete(item, blob);
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

    complete(item, blob);
  };

  const complete = (data: HistoryItem, blob: Blob) => {
    setPendingItem(data);
    setPendingBlob(blob);
    setIsNameModalOpen(true);
    setIsProcessing(false);
    setStatusText("Awaiting filename...");
  };

  const confirmDownload = async (finalName: string) => {
    if (!pendingItem || !pendingBlob) return;

    const data = { ...pendingItem, name: finalName };

    // Download
    const a = document.createElement("a");
    a.href = data.url;
    a.download = data.name;
    a.click();

    // Persist blob to IndexedDB
    try {
      await saveFile(data.timestamp, pendingBlob);
    } catch (e) {
      console.error("Failed to save to IndexedDB", e);
    }

    // Update history
    const newHistory = [data, ...history].slice(0, 100);
    setHistory(newHistory);
    localStorage.setItem("pf-history", JSON.stringify(newHistory));

    // UI feedback
    setStatusText("");
    setIsNameModalOpen(false);
    setPendingItem(null);
    setPendingBlob(null);
    showToastMessage("Downloaded successfully");
  };

  const cancelDownload = () => {
    setIsNameModalOpen(false);
    setPendingItem(null);
    setPendingBlob(null);
    setStatusText("");
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

  const toggleTheme = () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pf-theme", next);
    setCurrentTheme(next);
  };

  const clearHistory = async () => {
    if (!confirm("Clear all history?")) return;
    setHistory([]);
    setSelectedItem(null);
    localStorage.removeItem("pf-history");
    try {
      await clearAllFiles();
    } catch (e) {
      console.error("Failed to clear storage", e);
    }
  };

  const stats = (() => {
    const totalSize = history.reduce((acc: number, item: HistoryItem) => acc + item.sizeBytes, 0);
    const imageCount = history.filter((item: HistoryItem) => item.type === "image").length;
    const textCount = history.filter((item: HistoryItem) => item.type === "text").length;
    return { totalSize: formatBytes(totalSize), imageCount, textCount };
  })();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-main">
      <Header
        history={history}
        stats={stats}
        currentTheme={currentTheme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          history={filteredHistory}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          onClearHistory={clearHistory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 flex transition-theme">
          <div className="flex-1 flex flex-col">
            {selectedItem ? (
              <DetailView 
                selectedItem={selectedItem} 
                onCopySuccess={showToastMessage}
              />
            ) : (
              <EmptyState isProcessing={isProcessing} />
            )}

            <StatusBar
              isProcessing={isProcessing}
              statusText={statusText}
              selectedItem={selectedItem}
            />
          </div>

          {selectedItem && (
            <PropertiesPanel
              selectedItem={selectedItem}
              onRedownload={redownload}
            />
          )}
        </main>
      </div>

      <Toast show={showToast} message={toastMessage} />

      {pendingItem && (
        <NameModal
          isOpen={isNameModalOpen}
          defaultName={pendingItem.name}
          onConfirm={confirmDownload}
          onCancel={cancelDownload}
        />
      )}
    </div>
  );
}



