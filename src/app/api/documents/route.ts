import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, createDocument } from '@/lib/db';
import { generateId, generateShareToken } from '@/lib/utils';

export async function GET() {
  try {
    const allDocs = getDocuments();
    // Return simplified list (without content)
    const list = allDocs.map(doc => ({
      id: doc.id,
      title: doc.title,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const id = generateId();
    const shareToken = generateShareToken();

    createDocument({
      id,
      title: 'Untitled.md',
      content: '',
      shareToken,
    });

    return NextResponse.json({ id, shareToken });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}