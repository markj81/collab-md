# Architecture

## Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js   │────▶│  SQLite    │
│  (Client)   │     │   (API)    │     │  (Drizzle) │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │              ┌─────┴─────┐
       │              │           │
       ▼              ▼           ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐
│  CodeMirror │ │  PartyKit│ │  Clerk   │
│   (Editor)  │ │  (WS)    │ │  (Auth)  │
└─────────────┘ └──────────┘ └──────────┘
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── documents/     # Document CRUD endpoints
│   │   └── share/          # Share token endpoints
│   ├── editor/[id]/       # Editor page
│   ├── share/[token]/     # Shared document view
│   └── page.tsx            # Landing/dashboard
├── components/
│   ├── editor/            # CodeMirror components
│   ├── DocumentList.tsx   # Document listing
│   └── ...
├── hooks/
│   └── use-collaboration.ts  # Yjs real-time hook
├── lib/
│   ├── db/                 # Drizzle database
│   └── utils.ts           # Utilities
└── types/
    └── index.ts           # TypeScript types
```

## Key Components

### Editor (CodeMirror + Yjs)

- CodeMirror 6 for the markdown editor
- Yjs CRDT for conflict-free collaboration
- y-codemirror.next binds Yjs to CodeMirror

### Real-time Sync (PartyKit)

- WebSocket server handles Yjs document sync
- Awareness protocol tracks connected users
- Persists document state to database

### Authentication (Clerk)

- Handles user sign-in/sign-up
- Middleware protects routes
- User ID links documents to owners

### Database (SQLite + Drizzle)

- SQLite for local persistence
- Drizzle ORM for type-safe queries
- Documents table stores content

## Data Flow

1. User opens document
2. Next.js serves page, fetches initial content from SQLite
3. Yjs connects to PartyKit WebSocket
4. Real-time edits sync via Yjs
5. Periodically, content saves to SQLite via API

## Share System

- Each document has a unique `shareToken`
- Share permissions: `read-only` or `editable`
- Public documents accessible without auth
- Private documents require Clerk authentication
