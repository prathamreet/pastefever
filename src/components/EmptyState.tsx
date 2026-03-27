"use client";

interface EmptyStateProps {
  isProcessing: boolean;
}

export const EmptyState = ({ isProcessing }: EmptyStateProps) => {
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
  );
};
