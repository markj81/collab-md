import Redis from 'ioredis';

// Global Redis client (cached across HMR in development)
declare global {
  var redis: Redis | undefined;
}

// Key prefix for namespace
const DOCS_KEY = 'collab-md:documents';
const DOC_KEY = (id: string) => `collab-md:doc:${id}`;

// Lazy Redis client initialization
let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (redisClient) return redisClient;

  if (process.env.KV_URL) {
    redisClient = new Redis(process.env.KV_URL);
  } else {
    if (!global.redis) {
      global.redis = new Redis(process.env.LOCAL_KV_URL || 'redis://localhost:6379');
    }
    redisClient = global.redis as Redis;
  }
  return redisClient;
}

function useRedis<T>(fn: (redis: Redis) => Promise<T>): Promise<T> {
  const redis = getRedisClient();
  return fn(redis);
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
    const ids = await useRedis(async (redis) => await redis.smembers(DOCS_KEY));
    if (ids.length === 0) return [];

    const pipeline = (await useRedis(async (redis) => {
      const pipe = redis.pipeline();
      ids.forEach((id) => {
        pipe.get(DOC_KEY(id));
      });
      return pipe.exec();
    })) as Array<[Error | null, string | null]>;

    const documents: Document[] = [];

    pipeline.forEach(([err, value]) => {
      if (!err && value) {
        try {
          documents.push(JSON.parse(value));
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
    const data = await useRedis(async (redis) => await redis.get(DOC_KEY(id)));
    return data ? JSON.parse(data) : null;
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

    await useRedis(async (redis) => {
      const pipeline = redis.pipeline();
      pipeline.set(DOC_KEY(doc.id), JSON.stringify(newDoc));
      pipeline.sadd(DOCS_KEY, doc.id);
      await pipeline.exec();
    });

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

    await useRedis(async (redis) => {
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
    await useRedis(async (redis) => {
      const pipeline = redis.pipeline();
      pipeline.del(DOC_KEY(id));
      pipeline.srem(DOCS_KEY, id);
      await pipeline.exec();
    });
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

export async function getDocumentByShareToken(token: string): Promise<Document | null> {
  try {
    const ids = await useRedis(async (redis) => await redis.smembers(DOCS_KEY));
    if (ids.length === 0) return null;

    for (const id of ids) {
      const data = await useRedis(async (redis) => await redis.get(DOC_KEY(id)));
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