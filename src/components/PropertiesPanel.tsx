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
    <aside className="w-80 border-l border-main bg-alt flex flex-col transition-theme">
      <div className="p-6 border-b border-light flex items-center h-16">
        <h3 className="text-sm font-bold text-main">
          Details
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">File Name</span>
              <p className="text-sm font-bold text-main break-all">{selectedItem.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Format</span>
                <p className="text-sm font-bold text-main">{(selectedItem.extension || "").toUpperCase()}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Size</span>
                <p className="text-sm font-bold text-main">{selectedItem.size}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-[10px] font-bold text-faint uppercase tracking-widest border-b border-light pb-2">Technical Stats</h4>
          <div className="space-y-3">
            {selectedItem.type === "image" ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Dimensions</span>
                  <span className="text-xs font-bold text-main">{selectedItem.width} × {selectedItem.height}px</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Aspect Ratio</span>
                  <span className="text-xs font-bold text-main">
                    {(selectedItem.width! / selectedItem.height!).toFixed(2)}:1
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Lines</span>
                  <span className="text-xs font-bold text-main">{selectedItem.lines}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Characters</span>
                  <span className="text-xs font-bold text-main">{selectedItem.characters}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-muted">Added</span>
              <span className="text-xs font-bold text-main">
                {new Date(selectedItem.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-light bg-main/30">
        <button
          onClick={() => onRedownload(selectedItem)}
          className="w-full py-3 bg-accent text-alt text-sm font-bold rounded-xl hover:bg-main hover:text-main transition-all border border-transparent hover:border-border shadow-sm active:scale-[0.98]"
        >
          Download File
        </button>
      </div>
    </aside>
  );
};
