export interface HistoryItem {
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
