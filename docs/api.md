# API Reference

## Documents API

### GET /api/documents

Get all documents for the authenticated user.

**Auth**: Required (Clerk)

**Response:**
```json
[
  {
    "id": "doc_abc123",
    "title": "My Document",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z"
  }
]
```

### POST /api/documents

Create a new document.

**Auth**: Required (Clerk)

**Response:**
```json
{
  "id": "doc_abc123",
  "shareToken": "share_xyz789"
}
```

---

### GET /api/documents/:id

Get a specific document by ID.

**Auth**: Required (Clerk) - must own document

**Response:**
```json
{
  "id": "doc_abc123",
  "title": "My Document",
  "content": "# Hello World",
  "shareToken": "share_xyz789",
  "isPublic": false,
  "sharePermission": "editable",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

### PUT /api/documents/:id

Update document title or content.

**Auth**: Required (Clerk) - must own document

**Request Body:**
```json
{
  "title": "New Title",
  "content": "# Updated Content"
}
```

### PATCH /api/documents/:id

Update document settings (sharing).

**Auth**: Required (Clerk) - must own document

**Request Body:**
```json
{
  "isPublic": true,
  "sharePermission": "read-only"
}
```

### DELETE /api/documents/:id

Delete a document.

**Auth**: Required (Clerk) - must own document

**Response:**
```json
{
  "success": true
}
```

---

## Share API

### GET /api/share/:token

Access a shared document by token.

**Auth**: Required for private documents, optional for public

**Response:**
```json
{
  "id": "doc_abc123",
  "title": "My Document",
  "content": "# Shared Content",
  "isPublic": true,
  "sharePermission": "editable"
}
```

---

## Real-time Collaboration

### WebSocket Connection

Documents use Yjs for real-time collaboration via PartyKit.

**Connection URL**: `wss://[PARTYKIT_HOST]/party/[document_id]`

**Protocol**: y-websocket

### Awareness

User presence includes:
```json
{
  "clientId": 1,
  "user": {
    "name": "John Doe",
    "color": "#ff6b6b"
  }
}
```
