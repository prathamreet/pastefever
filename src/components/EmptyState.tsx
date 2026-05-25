"use client";

interface EmptyStateProps {
  isProcessing: boolean;
  onPasteClick?: () => void;
}

export const EmptyState = ({ isProcessing, onPasteClick }: EmptyStateProps) => {
  return (
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
          Paste any image or text to instantly download it. Everything stays on
          your device.
        </p>

        {/* Desktop Keyboard Prompts */}
        <div className="hidden md:inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-alt border border-main shadow-sm">
          <kbd className="px-3 py-1.5 text-xs font-medium text-soft bg-main rounded border border-border">
            Ctrl
          </kbd>
          <span className="text-xs text-muted">+</span>
          <kbd className="px-3 py-1.5 text-xs font-medium text-soft bg-main rounded border border-border">
            V
          </kbd>
        </div>

        {/* Mobile Tap to Paste Button */}
        {onPasteClick && (
          <div className="md:hidden">
            <button
              onClick={onPasteClick}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-[var(--bg-alt)] hover:bg-soft text-sm font-bold shadow-lg shadow-accent/15 active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Tap to Paste
            </button>
          </div>
        )}

        {/* <div className="mt-8 pt-8 border-t border-light">
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
        </div> */}
      </div>
    </div>
  );
};
