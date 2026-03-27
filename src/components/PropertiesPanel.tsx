"use client";

import { HistoryItem } from "@/types";

interface PropertiesPanelProps {
  selectedItem: HistoryItem;
  onRedownload: (item: HistoryItem) => void;
}

export const PropertiesPanel = ({
  selectedItem,
  onRedownload,
}: PropertiesPanelProps) => {
  return (
    <aside className="w-72 border-l border-main bg-alt p-6 overflow-y-auto">
      <h3 className="text-xs font-medium text-soft uppercase tracking-wide mb-4">
        Properties
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted block mb-1">File name</label>
          <p className="text-sm text-main font-medium break-all">
            {selectedItem.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted block mb-1">Type</label>
            <p className="text-sm text-main font-medium">
              {selectedItem.extension}
            </p>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Size</label>
            <p className="text-sm text-main font-medium">{selectedItem.size}</p>
          </div>
        </div>

        {selectedItem.type === "image" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted block mb-1">Width</label>
                <p className="text-sm text-main font-medium">
                  {selectedItem.width}px
                </p>
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Height</label>
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
                  ? `${(selectedItem.width / selectedItem.height).toFixed(2)}:1`
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
                <label className="text-xs text-muted block mb-1">Words</label>
                <p className="text-sm text-main font-medium">
                  {selectedItem.words?.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1">Lines</label>
              <p className="text-sm text-main font-medium">
                {selectedItem.lines?.toLocaleString()}
              </p>
            </div>
          </>
        )}

        <div>
          <label className="text-xs text-muted block mb-1">Created</label>
          <p className="text-sm text-main font-medium">
            {new Date(selectedItem.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="pt-4 border-t border-light">
          <button
            onClick={() => onRedownload(selectedItem)}
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
  );
};
