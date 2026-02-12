export interface Document {
  id: string;
  title: string;
  content: string | null;
  shareToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAwareness {
  clientId: number;
  user: {
    name: string;
    color: string;
  };
}

export type DocumentListItem = Pick<Document, 'id' | 'title' | 'createdAt' | 'updatedAt'>;