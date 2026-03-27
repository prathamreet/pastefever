# PasteFever

PasteFever is a minimalist web utility for converting clipboard content into files. It is designed for high-speed workflows where you need to save images or text snippets instantly without manual file creation.

## Purpose
The tool aims to bridge the gap between "copying from the web" and "saving to local storage" with zero friction. It automates the process of naming and downloading assets derived from the system clipboard.

## Features
- Instant image and text conversion (PNG, JPG, GIF, WEBP, TXT).
- Custom file naming prompt on paste.
- Live session history and file property inspector.
- Real-time file search.
- Adaptive light and dark themes.

## Privacy Policy
PasteFever is a 100% client-side application. No data is ever transmitted to a server. All processing, storage (IndexedDB), and history management happen locally in your browser.

## Data Handling
Files and metadata are stored using the following local browser technologies:
- **IndexedDB**: High-capacity storage for original file blobs.
- **LocalStorage**: Persistence for UI preferences and history metadata.
- **URL.createObjectURL**: Temporary memory allocation for previews.
Clearing your history via the interface permanently deletes all data from these stores.

## Shortcut Keys
- **Ctrl + V**: Paste and initiate download.
- **Enter**: Confirm file name in prompt.
- **Esc**: Cancel download prompt or deselect object.

## Tech Stack
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Storage**: IndexedDB (Local DB)

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