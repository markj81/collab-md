import Redis from 'ioredis';

// Global Redis client (cached across HMR in development)
declare global {
  var redis: Redis | undefined;
}

// Key prefix for namespace
const DOCS_KEY = 'collab-md:documents';
const DOC_KEY = (id: string) => `collab-md:doc:${id}`;

// Lazy Redis client initialization with better error handling
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  // Return null if no KV_URL available
  if (!process.env.KV_URL) {
    console.warn('KV_URL not set - Redis will not be available');
    return null;
  }

  if (redisClient) return redisClient;

  try {
    redisClient = new Redis(process.env.KV_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });
  } catch (err) {
    console.error('Failed to create Redis client:', err);
    return null;
  }

  return redisClient;
}

async function withRedis<T>(fn: (redis: Redis) => Promise<T>): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) {
    console.warn('Redis not available');
    return null;
  }
  try {
    return await fn(redis);
  } catch (err) {
    console.error('Redis operation error:', err);
    return null;
  }
}

interface Document {
  id: string;
  title: string;
  content: string | null;
  shareToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getDocuments(): Promise<Document[]> {
  try {
    const ids = await withRedis(async (redis) => await redis.smembers(DOCS_KEY));
    if (!ids) return [];

    const pipeline = await withRedis(async (redis) => {
      const pipe = redis.pipeline();
      ids.forEach((id) => {
        pipe.get(DOC_KEY(id));
      });
      return pipe.exec();
    });
    if (!pipeline) return [];

    const documents: Document[] = [];

    pipeline.forEach(([err, value]) => {
      if (!err && value) {
        try {
          documents.push(JSON.parse(value as string));
        } catch (e) {
          console.error('Error parsing document:', e);
        }
      }
    });

    return documents.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

export async function getDocument(id: string): Promise<Document | null> {
  try {
    const data = await withRedis(async (redis) => await redis.get(DOC_KEY(id)));
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}

export async function createDocument(doc: Omit<Document, 'createdAt' | 'updatedAt'>): Promise<Document | null> {
  try {
    const now = new Date().toISOString();
    const newDoc: Document = {
      ...doc,
      createdAt: now,
      updatedAt: now,
    };

    const result = await withRedis(async (redis) => {
      const pipeline = redis.pipeline();
      pipeline.set(DOC_KEY(doc.id), JSON.stringify(newDoc));
      pipeline.sadd(DOCS_KEY, doc.id);
      return pipeline.exec();
    });

    if (!result) {
      console.error('Failed to save document to Redis');
      return null;
    }

    return newDoc;
  } catch (error) {
    console.error('Error creating document:', error);
    return null;
  }
}

export async function updateDocument(
  id: string,
  updates: Partial<Omit<Document, 'id' | 'createdAt'>>
): Promise<Document | null> {
  try {
    const existing = await getDocument(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: Document = {
      ...existing,
      ...updates,
      updatedAt: now,
    };

    await withRedis(async (redis) => {
      await redis.set(DOC_KEY(id), JSON.stringify(updated));
    });

    return updated;
  } catch (error) {
    console.error('Error updating document:', error);
    return null;
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    const result = await withRedis(async (redis) => {
      const pipeline = redis.pipeline();
      pipeline.del(DOC_KEY(id));
      pipeline.srem(DOCS_KEY, id);
      return pipeline.exec();
    });

    return result !== null;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

export async function getDocumentByShareToken(token: string): Promise<Document | null> {
  try {
    const ids = await withRedis(async (redis) => await redis.smembers(DOCS_KEY));
    if (!ids) return null;

    for (const id of ids) {
      const data = await withRedis(async (redis) => await redis.get(DOC_KEY(id)));
      if (data) {
        const doc = JSON.parse(data) as Document;
        if (doc.shareToken === token) {
          return doc;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching document by token:', error);
    return null;
  }
}