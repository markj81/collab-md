'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { MarkdownPreview } from '@/components/editor/MarkdownPreview';
import { ShareButton } from '@/components/ShareButton';
import { useCollaboration } from '@/hooks/use-collaboration';
import * as Y from 'yjs';

interface DocumentData {
  id: string;
  title: string;
  content: string | null;
  shareToken: string | null;
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [content, setContent] = useState('');

  // Stable setContent for editor
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  // Collaboration
  const { ydoc, yText, isConnected, users } = useCollaboration({
    documentId,
  });

  const fetchDocument = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents/${documentId}`);
      if (res.status === 404) {
        router.push('/');
        return;
      }
      const data = await res.json();
      setDocument(data);
      setTitle(data.title);
      setContent(data.content || '');
    } catch (error) {
      console.error('Failed to fetch document:', error);
    } finally {
      setLoading(false);
    }
  }, [documentId, router]);

  // Set random user info once
  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // Debounced save ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save document
  const saveDocument = useCallback(
    async (newContent?: string) => {
      if (!documentId) return;
      setSaving(true);
      try {
        await fetch(`/api/documents/${documentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content: newContent ?? content,
          }),
        });
      } catch (error) {
        console.error('Failed to save document:', error);
      } finally {
        setSaving(false);
      }
    },
    [documentId, title, content]
  );

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) saveDocument();
    }, 30000);
    return () => clearInterval(interval);
  }, [saveDocument, loading]);

  // Debounced auto-save on content change (saves 1 second after typing stops)
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (!loading) saveDocument();
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, saveDocument, loading]);

  // Debounced auto-save on content change
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (!loading && content) {
        saveDocument();
      }
    }, 2000);
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, loading, saveDocument]);

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Debounced save for title
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveDocument();
    }, 500);
  };

  const handleBack = () => {
    saveDocument();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-lg font-semibold text-slate-900 bg-transparent border-none outline-none focus:ring-0"
              placeholder="Untitled.md"
            />
            {saving && (
              <span className="text-xs text-slate-400">Saving...</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Connected users */}
            {isConnected && users.length > 0 && (
              <div className="flex items-center gap-1">
                {users.slice(0, 3).map((user) => (
                  <div
                    key={user.clientId}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: user.user.color }}
                    title={user.user.name}
                  >
                    {user.user.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {users.length > 3 && (
                  <span className="text-xs text-slate-500">+{users.length - 3}</span>
                )}
              </div>
            )}

            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-md text-sm font-medium transition-colors ${
                showPreview
                  ? 'bg-slate-100 text-slate-700'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>

            {document?.shareToken && (
              <ShareButton
                shareUrl={document.shareToken}
                documentTitle={title}
              />
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <MarkdownEditor
            key={documentId}
            documentId={documentId}
            yText={yText || undefined}
            initialContent={content}
            onChange={handleContentChange}
          />
        </div>
        {showPreview && (
          <div className="w-1/2 border-l border-slate-200 bg-white">
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>
    </div>
  );
}