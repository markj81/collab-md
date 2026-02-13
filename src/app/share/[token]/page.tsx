'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const token = params.token as string;

  const [documentId, setDocumentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/share/${token}`);
        if (res.status === 404) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setDocumentId(data.id);
        setTitle(data.title);
      } catch (err) {
        console.error('Failed to fetch document:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#101112]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">Loading shared document...</p>
        </div>
      </div>
    );
  }

  if (error || !documentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#101112]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Document Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            This share link may be invalid or the document has been deleted.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#101112]">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#101112]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-slate-900 dark:bg-white rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-sm font-medium text-slate-900 dark:text-white">CollabMD</h1>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
              Shared View
            </span>
          </div>
          <a
            href={`/editor/${documentId}`}
            className="px-2 py-1 text-xs font-medium rounded transition-colors bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90"
          >
            Open in Editor
          </a>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            {title || 'Untitled'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You've been shared a collaborative markdown document.
          </p>
          <a
            href={`/editor/${documentId}`}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md transition-colors bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Open in Editor
          </a>
        </div>
      </main>
    </div>
  );
}