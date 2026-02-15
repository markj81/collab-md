export interface Document {
  id: string;
  title: string;
  content: string | null;
  shareToken: string | null;
  isPublic: boolean;
  sharePermission: 'read-only' | 'editable';
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