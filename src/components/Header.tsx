"use client";

import { HistoryItem } from "@/types";

interface HeaderProps {
  history: HistoryItem[];
  stats: {
    totalSize: string;
    imageCount: number;
    textCount: number;
  };
  currentTheme: "light" | "dark";
  onToggleTheme: () => void;
  onDownloadAll: () => void;
}

export const Header = ({
  history,
  stats,
  currentTheme,
  onToggleTheme,
  onDownloadAll,
}: HeaderProps) => {
  return (
    <header className="border-b border-main bg-alt transition-theme z-10">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <a href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold tracking-tight text-main">
              PasteFever
            </h1>
          </a>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onDownloadAll}
            disabled={history.length === 0}
            className="w-10 h-10 rounded-xl hover:bg-main transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-muted hover:text-main"
            title="Download All as ZIP"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <a
            href="https://github.com/prathamreet/pastefever"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl hover:bg-main transition-all flex items-center justify-center text-muted hover:text-main cursor-pointer"
            title="GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          </a>

          <button
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-xl hover:bg-main transition-all flex items-center justify-center text-muted hover:text-main cursor-pointer"
            title="Toggle Theme"
          >
            {currentTheme === "dark" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
