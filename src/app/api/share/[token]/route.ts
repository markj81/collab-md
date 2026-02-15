import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDocumentByShareToken } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { userId } = await auth();

  try {
    const doc = await getDocumentByShareToken(token);

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Private documents require authentication
    if (!doc.isPublic && !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      isPublic: doc.isPublic,
      sharePermission: doc.sharePermission,
    });
  } catch (error) {
    console.error('Error fetching document by token:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}