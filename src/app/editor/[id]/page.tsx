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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState({ words: 0, chars: 0 });

  // Stable setContent for editor
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleWordCountChange = useCallback((words: number, chars: number) => {
    setWordCount({ words, chars });
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
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save document:', error);
      } finally {
        setSaving(false);
      }
    },
    [documentId, title, content]
  );

  // Auto-save on content change (saves 1 second after typing stops)
  useEffect(() => {
    if (loading || !content) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveDocument();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, loading, saveDocument]);

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
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

  // Format time since last save
  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet';
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBack}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-lg font-semibold text-slate-900 bg-transparent border-none outline-none focus:ring-0 min-w-0 truncate"
              placeholder="Untitled.md"
            />
            <div className="flex items-center gap-2 text-xs text-slate-400 flex-shrink-0">
              {saving ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {formatLastSaved()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Word count */}
            <div className="text-xs text-slate-400 px-2">
              {wordCount.words} words · {wordCount.chars} chars
            </div>

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
                  <span className="text-xs text-slate-500 ml-1">+{users.length - 3}</span>
                )}
              </div>
            )}

            {/* Connection status */}
            <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
              isConnected ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-slate-400'}`} />
              {isConnected ? 'Connected' : 'Offline'}
            </div>

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
            onWordCountChange={handleWordCountChange}
          />
        </div>
        {showPreview && (
          <div className="w-1/2 border-l border-slate-200 bg-white overflow-auto">
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>
    </div>
  );
}