"use client";

import { useState, useEffect, useRef } from "react";

interface NameModalProps {
  isOpen: boolean;
  defaultName: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export const NameModal = ({
  isOpen,
  defaultName,
  onConfirm,
  onCancel,
}: NameModalProps) => {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Extract the name without extension for easier editing
      const lastDotIndex = defaultName.lastIndexOf(".");
      const nameWithoutExt =
        lastDotIndex !== -1 ? defaultName.substring(0, lastDotIndex) : defaultName;
      setName(nameWithoutExt);

      // Focus and select the text
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
    const lastDotIndex = defaultName.lastIndexOf(".");
    const ext = lastDotIndex !== -1 ? defaultName.substring(lastDotIndex) : "";
    const finalName = name.trim() ? `${name.trim()}${ext}` : defaultName;
    onConfirm(finalName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-alt border border-main rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-main">Name your file</h3>
              <p className="text-xs text-muted">Set a custom name or leave as default</p>
            </div>
          </div>

          <div className="relative mb-6">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-xl bg-main border border-border text-main placeholder-faint focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm pr-12"
              placeholder="Filename"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">
              {defaultName.substring(defaultName.lastIndexOf("."))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-main transition-colors border border-transparent hover:border-border"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-accent hover:bg-soft transition-all shadow-md shadow-accent/20 active:scale-[0.98]"
            >
              Download
            </button>
          </div>
        </div>

        {/* Shortcut indicator */}
        <div className="px-6 py-3 bg-main border-t border-main flex justify-center gap-4">
          <div className="flex items-center gap-1.5 opacity-40">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-alt rounded border border-border">Enter</kbd>
            <span className="text-[10px]">confirm</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-40">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-alt rounded border border-border">Esc</kbd>
            <span className="text-[10px]">cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
};
