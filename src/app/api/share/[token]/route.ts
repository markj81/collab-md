import { NextRequest, NextResponse } from 'next/server';
import { getDocumentByShareToken } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  try {
    const doc = await getDocumentByShareToken(token);

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, title: doc.title });
  } catch (error) {
    console.error('Error fetching document by token:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}