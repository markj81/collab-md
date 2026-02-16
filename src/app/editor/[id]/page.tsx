'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { MarkdownPreview } from '@/components/editor/MarkdownPreview';
import { ShareButton } from '@/components/ShareButton';
import { useCollaboration } from '@/hooks/use-collaboration';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/components/Toast';
import '@/app/editor-dark.css';
import * as Y from 'yjs';

interface DocumentData {
  id: string;
  title: string;
  content: string | null;
  shareToken: string | null;
  isPublic: boolean;
  sharePermission: 'read-only' | 'editable';
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const documentId = params.id as string;

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState({ words: 0, chars: 0 });

  const { ydoc, yText, isConnected, users } = useCollaboration({
    documentId,
  });

  // Store content in a ref for button handlers
  const contentRef = useRef(content);
  const yTextRef = useRef(yText);

  // Update refs whenever content or yText changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    yTextRef.current = yText;
  }, [yText]);

  // Also update on every render to catch any changes
  contentRef.current = content;
  yTextRef.current = yText;

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    contentRef.current = newContent;
  }, []);

  const handleWordCountChange = useCallback((words: number, chars: number) => {
    setWordCount({ words, chars });
  }, []);

  // Get current content
  const getContent = useCallback(() => {
    // First try yText (collaborative editing)
    if (yTextRef.current) {
      const yContent = yTextRef.current.toString();
      console.log('yText exists, content:', yContent ? `${yContent.length} chars` : 'empty');
      if (yContent) return yContent;
    } else {
      console.log('yText is null');
    }
    // Fallback to content state
    console.log('Using contentRef:', contentRef.current ? `${contentRef.current.length} chars` : 'empty');
    return contentRef.current;
  }, []);

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

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saving]);

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

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet';
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBack}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-sm font-medium text-slate-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 min-w-0 truncate placeholder-slate-400"
              placeholder="Untitled.md"
            />
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0">
              {saving ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-slate-300'}`} />
                  {isConnected ? 'Saved' : 'Offline'}
                </span>
              )}
            </div>
            {/* Mobile saving indicator - icon only */}
            <div className="md:hidden" title={saving ? 'Saving...' : (isConnected ? 'Saved' : 'Offline')}>
              {saving ? (
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-slate-300'}`} />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Connected users */}
            {isConnected && users.length > 0 && (
              <div className="flex items-center gap-0.5 mr-1">
                {users.slice(0, 3).map((user) => (
                  <div
                    key={user.clientId}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-medium -ml-1 first:ml-0 ring-2 ring-white dark:ring-[#0a0a0a]"
                    style={{ backgroundColor: user.user.color }}
                    title={user.user.name}
                  >
                    {user.user.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {users.length > 3 && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-medium -ml-1 bg-slate-400 ring-2 ring-white dark:ring-[#0a0a0a]"
                    title={`${users.length - 3} more users`}
                  >
                    +{users.length - 3}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg md:hidden">
              <button
                onClick={() => setActiveTab('write')}
                className={`p-1.5 rounded-md transition-colors ${
                  activeTab === 'write'
                    ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                aria-label="Write"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`p-1.5 rounded-md transition-colors ${
                  activeTab === 'preview'
                    ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                aria-label="Preview"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            {document?.shareToken && (
              <ShareButton
                shareUrl={document.shareToken}
                documentTitle={title}
                documentId={document.id}
                initialIsPublic={document.isPublic}
                initialPermission={document.sharePermission}
              />
            )}

            <button
              onClick={() => {
                // Get content directly from state
                const textToCopy = content || yText?.toString() || '';
                console.log('Copying, content:', content.length, 'yText:', yText?.toString().length);
                navigator.clipboard.writeText(textToCopy);
                showToast('Copied to clipboard!', 'success');
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              aria-label="Copy markdown to clipboard"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            <button
              onClick={() => {
                // Get content directly from state
                const textToSave = content || yText?.toString() || '';
                const blob = new Blob([textToSave], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = globalThis.document.createElement('a');
                a.href = url;
                a.download = (title || 'Untitled') + '.md';
                globalThis.document.body.appendChild(a);
                a.click();
                globalThis.document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('Downloaded markdown file', 'success');
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              aria-label="Download markdown file"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-y-auto">
        {/* Editor - hidden on mobile when preview tab is active */}
        <div className={`flex-1 flex flex-col min-w-0 ${activeTab === 'preview' ? 'hidden md:block' : 'block'} md:w-1/2`}>
          <MarkdownEditor
            key={documentId}
            documentId={documentId}
            yText={yText || undefined}
            initialContent={content}
            onChange={handleContentChange}
            onWordCountChange={handleWordCountChange}
            wordCount={wordCount}
          />
        </div>
        {/* Preview - hidden on mobile when write tab is active */}
        <div className={`${activeTab === 'write' ? 'hidden md:block' : 'block'} w-full md:w-1/2 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] overflow-auto flex-shrink-0`}>
          <MarkdownPreview content={content} />
        </div>
      </div>
    </div>
  );
}