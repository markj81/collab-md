# Graph Report - collab-md  (2026-11-23)

## Corpus Check
- 40 files · ~12,397 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 269 nodes · 430 edges · 25 communities (16 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a88a997`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [id]/page.tsx
- db/index.ts
- Collab MD
- app/page.tsx
- devDependencies
- compilerOptions
- dependencies
- Documents API
- next
- MarkdownEditor.tsx
- package.json
- ws-server.js
- scripts
- Server
- use-collaboration.ts
- vercel.json
- CLAUDE.md
- .claude/CLAUDE.md
- ioredis
- @types/better-sqlite3@^7.6.13
- typescript@^5.9.3
- y-partykit
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `@clerk/nextjs` - 13 edges
3. `react` - 12 edges
4. `next` - 11 edges
5. `useTheme()` - 11 edges
6. `scripts` - 9 edges
7. `withRedis()` - 8 edges
8. `getDocument()` - 8 edges
9. `Collab MD` - 8 edges
10. `EditorPage()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getDocuments()`  [EXTRACTED]
  src/app/api/documents/route.ts → src/lib/db/index.ts
- `GET()` --calls--> `getDocumentByShareToken()`  [EXTRACTED]
  src/app/api/share/[token]/route.ts → src/lib/db/index.ts
- `EditorPage()` --calls--> `useCollaboration()`  [EXTRACTED]
  src/app/editor/[id]/page.tsx → src/hooks/use-collaboration.ts
- `RootLayout()` --calls--> `Providers()`  [EXTRACTED]
  src/app/layout.tsx → src/components/Providers.tsx
- `Home()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/page.tsx → src/components/ThemeProvider.tsx

## Import Cycles
- None detected.

## Communities (25 total, 9 thin omitted)

### Community 0 - "[id]/page.tsx"
Cohesion: 0.15
Nodes (21): react, DocumentData, EditorPage(), ShareDocumentData, SharePage(), MarkdownEditor(), MarkdownPreview(), MarkdownPreviewProps (+13 more)

### Community 1 - "db/index.ts"
Cohesion: 0.19
Nodes (21): DELETE(), GET(), PATCH(), PUT(), GET(), POST(), GET(), createDocument() (+13 more)

### Community 2 - "Collab MD"
Cohesion: 0.08
Nodes (22): Architecture, Authentication (Clerk), Data Flow, Database (SQLite + Drizzle), Editor (CodeMirror + Yjs), Key Components, Overview, Project Structure (+14 more)

### Community 3 - "app/page.tsx"
Cohesion: 0.12
Nodes (15): @clerk/nextjs@^6.37.3, @clerk/nextjs, formatDate(), Home(), SortOption, DocumentList(), DocumentListProps, FloatingCursor() (+7 more)

### Community 4 - "devDependencies"
Cohesion: 0.10
Nodes (19): devDependencies, autoprefixer@^10.4.24, drizzle-kit@^0.30.6, eslint@^10.0.0, @eslint/js@^10.0.1, postcss@^8.5.6, tailwindcss@^4.1.18, @tailwindcss/postcss@^4.1.18 (+11 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, clsx@^2.1.1, concurrently@^9.2.1, react@^19.2.4, react-dom@^19.2.4, react-markdown@^9.1.0, @types/node@^22.19.11, @types/react@^19.2.14 (+10 more)

### Community 7 - "Documents API"
Cohesion: 0.15
Nodes (13): API Reference, Awareness, DELETE /api/documents/:id, Documents API, GET /api/documents, GET /api/documents/:id, GET /api/share/:token, PATCH /api/documents/:id (+5 more)

### Community 8 - "next"
Cohesion: 0.17
Nodes (8): nextConfig, next@^15.5.12, next, geistMono, geistSans, metadata, RootLayout(), Providers()

### Community 9 - "MarkdownEditor.tsx"
Cohesion: 0.15
Nodes (11): @codemirror/commands@^6.10.2, @codemirror/lang-markdown@^6.5.0, @codemirror/view@^6.39.14, y-codemirror.next@^0.3.5, yjs@^13.6.29, @codemirror/commands, @codemirror/lang-markdown, @codemirror/view (+3 more)

### Community 10 - "package.json"
Cohesion: 0.17
Nodes (11): better-sqlite3@^11.10.0, drizzle-orm@^0.38.4, @eslint/eslintrc@^3.3.3, vercel@^50.17.0, name, private, version, better-sqlite3 (+3 more)

### Community 11 - "ws-server.js"
Cohesion: 0.22
Nodes (8): docs, getYDoc(), http, server, setupWSConnection(), WebSocket, wss, Y

### Community 12 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, db:generate, db:push, dev, dev:next, dev:ws, lint (+1 more)

### Community 13 - "Server"
Cohesion: 0.25
Nodes (3): partykit@^0.0.115, partykit, Server

### Community 14 - "use-collaboration.ts"
Cohesion: 0.32
Nodes (6): COLORS, getRandomUser(), useCollaboration(), UseCollaborationOptions, UserPresence, YPartyKitProvider

### Community 15 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, outputDirectory, regions

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@clerk/nextjs` connect `app/page.tsx` to `[id]/page.tsx`, `db/index.ts`, `package.json`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14532019704433496 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `[id]/page.tsx`, `db/index.ts`, `package.json`, `app/page.tsx`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `Collab MD` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[id]/page.tsx` to `app/page.tsx`, `dependencies`, `MarkdownEditor.tsx`, `package.json`, `use-collaboration.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._