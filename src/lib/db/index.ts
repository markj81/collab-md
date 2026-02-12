import fs from 'fs';
import path from 'path';

// Use /tmp for ephemeral storage on Vercel (data won't persist between deployments)
// For production persistence, use Vercel KV or Neon PostgreSQL
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'documents.json');

// Ensure data directory exists
function ensureDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.error('Error creating data directory:', e);
  }
}

// Simple file-based database for serverless (ephemeral on Vercel)
interface Document {
  id: string;
  title: string;
  content: string | null;
  shareToken: string | null;
  createdAt: string;
  updatedAt: string;
}

function readDb(): Record<string, Document> {
  ensureDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading DB:', e);
  }
  return {};
}

function writeDb(data: Record<string, Document>): boolean {
  ensureDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Error writing DB:', e);
    return false;
  }
}

export function getDocuments(): Document[] {
  const db = readDb();
  return Object.values(db);
}

export function getDocument(id: string): Document | null {
  const db = readDb();
  return db[id] || null;
}

export function createDocument(doc: Omit<Document, 'createdAt' | 'updatedAt'>): Document | null {
  const db = readDb();
  const now = new Date().toISOString();
  const newDoc: Document = {
    ...doc,
    createdAt: now,
    updatedAt: now,
  };
  db[doc.id] = newDoc;
  if (!writeDb(db)) {
    console.error('Failed to persist document to file');
  }
  return newDoc;
}

export function updateDocument(id: string, updates: Partial<Omit<Document, 'id' | 'createdAt'>>): Document | null {
  const db = readDb();
  if (!db[id]) return null;
  const now = new Date().toISOString();
  db[id] = {
    ...db[id],
    ...updates,
    updatedAt: now,
  };
  writeDb(db);
  return db[id];
}

export function deleteDocument(id: string): boolean {
  const db = readDb();
  if (!db[id]) return false;
  delete db[id];
  return writeDb(db);
}

export function getDocumentByShareToken(token: string): Document | null {
  const db = readDb();
  return Object.values(db).find(doc => doc.shareToken === token) || null;
}