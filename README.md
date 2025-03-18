# Word Editor PWA

An offline-first PWA word editor built with Vue.js, TypeScript, and Fireproof.

## Features

- Create, edit, and save text documents
- Rich text formatting (bold, italic, underline, headings, lists, links, images)
- Export to Word (.docx) format
- Offline functionality with automatic sync
- Mobile-friendly responsive design
- PWA capabilities for installation on devices

## Tech Stack

- **Vue.js** and **TypeScript** for the core framework
- **Fireproof** for local-first database functionality
- **Tiptap** for the rich text editor
- **docx** for exporting to Word format
- **Vite** as the build tool
- **TailwindCSS** for styling
- **Pinia** for state management
- **Vite PWA** for Progressive Web App setup

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/biby-best/word-editor-pwa.git
cd word-editor-pwa
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Start the development server
```bash
npm run dev
# or
pnpm dev
```

4. Build for production
```bash
npm run build
# or
pnpm build
```

## PWA Features

This application is designed as a Progressive Web App, which means:

- It works offline
- Can be installed on mobile devices and desktops
- Provides a native-like experience
- Automatically synchronizes data when the connection is restored

## Local-First Architecture

The application uses Fireproof to provide local-first functionality:

- All data is stored locally on the device
- Changes are automatically synchronized when online
- CRUD operations work seamlessly in both online and offline modes

## License

MIT