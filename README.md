# PasteFever

PasteFever is a minimalist web utility for converting clipboard content into files. It is designed for high-speed workflows where you need to save images or text snippets instantly without manual file creation.

## Purpose
The tool aims to bridge the gap between "copying from the web" and "saving to local storage" with zero friction. It automates the process of naming and downloading assets derived from the system clipboard.

## Features
- Instant clipboard-to-file conversion (PNG, JPG, GIF, WEBP, TXT).
- Smart file naming (`adjective-noun-HHMM-DDMM`) via the naming prompt.
- Live session history with quick search and filtering.
- Resizable sidebar with integrated session metrics (Storage, File counts).
- Batch Export: Download all session files in a single ZIP archive.
- Clipboard utility: One-click copy for both text and image blobs.
- Adaptive light and dark themes.

## Privacy Policy
PasteFever is 100% client-side. No data is ever transmitted to a server. Processing, storage (IndexedDB), and history management happen entirely within your local browser environment.

## Data Handling
Assets and metadata are managed using:
- **IndexedDB**: Local high-capacity storage for original file blobs.
- **LocalStorage**: Persistence for UI state, user preferences, and history metadata.
- **JSZip**: Client-side bundling for the "Download All" feature.
Clearing your history permanently removes all data from these local stores.

## Shortcut Keys
- **Ctrl + V**: Paste and initiate file processing.
- **Enter**: Confirm filename in the prompt.
- **Esc**: Cancel prompt, clear search, or deselect preview.

## Tech Stack
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Library**: JSZip (for local batching)
- **Language**: TypeScript
- **Storage**: IndexedDB

## Contribution
Issues and pull requests are welcome. Feel free to fork the repository and propose changes that enhance the "utility-first" experience.

## Build and Run
Clone the repository:
```bash
git clone https://github.com/prathamreet/pastefever.git
cd pastefever
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```