# Collab MD

A real-time collaborative markdown editor where multiple users can write and preview documents together. Built with Next.js 15, CodeMirror 6, and Yjs CRDTs synced over PartyKit WebSockets.

## Features

- **Real-time collaboration** - Edit documents simultaneously with other users, powered by Yjs conflict-free replicated data types
- **Live markdown preview** - Side-by-side editor and rendered preview with syntax highlighting
- **Document sharing** - Generate share links with read-only or edit permissions
- **User authentication** - Sign in/up via Clerk with protected routes
- **Dark mode** - Theme toggle with system preference detection
- **Persistent storage** - Documents saved to SQLite via Drizzle ORM

## Architecture

```
Browser ──▶ Next.js 15 (App Router) ──▶ SQLite (Drizzle ORM)
   │              │
   ▼              ▼
CodeMirror 6   PartyKit (WebSocket)   Clerk (Auth)
   │              │
   └──── Yjs ─────┘
         (CRDT sync)
```

- **Editor**: CodeMirror 6 with `y-codemirror.next` binding for CRDT-aware editing
- **Sync**: Yjs documents sync through PartyKit WebSockets with awareness protocol for cursor tracking
- **Persistence**: Content periodically saves from Yjs state to SQLite via Next.js API routes
- **Auth**: Clerk middleware protects editor routes; public share links bypass auth for read access

## Getting Started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com) account (for authentication)
- A [PartyKit](https://partykit.io) account (for real-time sync)

### Setup

```bash
# Clone the repo
git clone https://github.com/markj81/collab-md.git
cd collab-md

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
PARTYKIT_HOST=your-project.partykit.dev
KV_URL=your_kv_url
REDIS_URL=your_redis_url
```

### Run

```bash
# Start both Next.js and WebSocket server
npm run dev

# Or run them separately
npm run dev:next    # Next.js on http://localhost:3000
npm run dev:ws      # WebSocket server
```

### Database

```bash
npm run db:generate   # Generate Drizzle migrations
npm run db:push       # Push schema to SQLite
```

## Project Structure

```
src/
├── app/
│   ├── api/documents/      # Document CRUD
│   ├── api/share/           # Share token endpoints
│   ├── editor/[id]/        # Editor page
│   ├── share/[token]/      # Public shared view
│   └── page.tsx             # Dashboard
├── components/
│   ├── editor/
│   │   ├── MarkdownEditor.tsx
│   │   └── MarkdownPreview.tsx
│   ├── DocumentList.tsx
│   ├── ShareButton.tsx
│   └── ThemeProvider.tsx
├── hooks/
│   └── use-collaboration.ts # Yjs real-time hook
├── lib/db/                  # Drizzle schema & queries
└── types/
server/
└── ws-server.js             # PartyKit WebSocket server
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, React 19 |
| Editor | CodeMirror 6 |
| Real-time | Yjs, PartyKit, y-websocket |
| Styling | Tailwind CSS 4, @tailwindcss/typography |
| Auth | Clerk |
| Database | SQLite (better-sqlite3), Drizzle ORM |
| Deployment | Vercel |

## Docs

- [API Reference](./docs/api.md)
- [Architecture](./docs/architecture.md)

## License

MIT
