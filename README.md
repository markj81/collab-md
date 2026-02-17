# Collab MD

A collaborative markdown editor with real-time synchronization, built with Next.js 15, Yjs, and PartyKit.

## Features

- **Real-time Collaboration** - Multiple users can edit documents simultaneously
- **Markdown Preview** - Live preview of markdown content
- **Authentication** - User accounts via Clerk
- **Document Sharing** - Share documents via unique links with read or edit permissions
- **Persistent Storage** - SQLite database with Drizzle ORM

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Clerk and database credentials

# Run development server (starts both Next.js and WebSocket server)
npm run dev

# Open http://localhost:3000
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database path | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_PARTYKIT_HOST` | PartyKit host for real-time | Yes |

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Editor**: CodeMirror 6 with Yjs binding
- **Real-time**: PartyKit, Yjs, y-websocket
- **Auth**: Clerk
- **Database**: SQLite + Drizzle ORM

## Documentation

- [API Reference](./docs/api.md)
- [Architecture](./docs/architecture.md)

## License

MIT
