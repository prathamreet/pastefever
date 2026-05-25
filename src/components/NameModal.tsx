"use client";

import { useState, useEffect, useRef } from "react";

interface NameModalProps {
  isOpen: boolean;
  defaultName: string;
  onConfirm: (name: string, ext: string) => void;
  onCancel: () => void;
}

export const NameModal = ({
  isOpen,
  defaultName,
  onConfirm,
  onCancel,
}: NameModalProps) => {
  const [name, setName] = useState("");
  const [ext, setExt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const extRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Extract the name without extension for easier editing
      const lastDotIndex = defaultName.lastIndexOf(".");
      const nameWithoutExt =
        lastDotIndex !== -1 ? defaultName.substring(0, lastDotIndex) : defaultName;
      const originalExt =
        lastDotIndex !== -1 ? defaultName.substring(lastDotIndex + 1) : "";

      setName(nameWithoutExt);
      setExt(originalExt);

      // Focus and select the filename text
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalName = name.trim() ? name.trim() : "untitled";
    // Strip leading dot if user typed it
    let finalExt = ext.trim().toLowerCase();
    if (finalExt.startsWith(".")) {
      finalExt = finalExt.substring(1);
    }
    onConfirm(finalName, finalExt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleExtFocus = () => {
    if (extRef.current) {
      extRef.current.select();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-alt border border-main rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 p-5 space-y-4">
        
        {/* Unified Input Row */}
        <div className="flex items-center gap-2">
          {/* Filename Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-xl bg-main border border-border text-main placeholder-faint focus:outline-none focus:ring-2 focus:ring-accent/50 focus-visible:outline-none transition-all text-sm font-semibold"
              placeholder="Filename"
            />
          </div>

          {/* Separator dot */}
          <div className="text-xl font-bold text-muted select-none px-0.5">.</div>

          {/* Extension Input */}
          <div className="relative w-20">
            <input
              ref={extRef}
              type="text"
              value={ext}
              onChange={(e) => setExt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleExtFocus}
              className="w-full px-3 py-3 rounded-xl bg-main border border-border text-main placeholder-faint focus:outline-none focus:ring-2 focus:ring-accent/50 focus-visible:outline-none transition-all text-sm text-center font-bold tracking-wide"
              placeholder="ext"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:bg-main transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--bg-alt)] bg-accent hover:bg-soft transition-all shadow-md shadow-accent/20 active:scale-[0.98] cursor-pointer"
          >
            Download
          </button>
        </div>

      </div>
    </div>
  );
};
