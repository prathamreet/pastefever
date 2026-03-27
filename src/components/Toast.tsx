"use client";

interface ToastProps {
  show: boolean;
  message: string;
}

export const Toast = ({ show, message }: ToastProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl border border-main bg-alt shadow-2xl transition-all duration-300 z-[100] ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
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
        <span className="text-sm font-medium text-main">{message}</span>
      </div>
    </div>
  );
};
