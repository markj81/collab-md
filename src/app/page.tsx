'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { DocumentList } from '@/components/DocumentList';
import { LandingPage } from '@/components/LandingPage';
import { useTheme } from '@/components/ThemeProvider';
import { DocumentListItem } from '@/types';

type SortOption = 'updated' | 'created' | 'title';

function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

export default function Home() {
  const { isSignedIn, isLoaded: authLoaded } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  const fetchDocuments = useCallback(async () => {
    if (!authLoaded) return;
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      } else if (res.status === 401) {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  }, [authLoaded]);

  useEffect(() => {
    if (authLoaded) {
      fetchDocuments();
    }
  }, [authLoaded, fetchDocuments]);

  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...documents];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc =>
        doc.title.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
    return result;
  }, [documents, searchQuery, sortBy]);

  const createDocument = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/documents', { method: 'POST' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create document');
      }
      const data = await res.json();
      if (data.id) {
        window.location.href = `/editor/${data.id}`;
      }
    } catch (error) {
      console.error('Failed to create document:', error);
      alert('Failed to create document. Please try again.');
      setCreating(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete document');
      }
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (!creating) {
          createDocument();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [creating]);

  // Show landing page for logged out users
  if (!isSignedIn && authLoaded) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#101112]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#101112]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-slate-900 dark:bg-white rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-sm font-medium text-slate-900 dark:text-white">CollabMD</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
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
            <button
              onClick={createDocument}
              disabled={creating}
              className="px-2 py-1 text-xs font-medium rounded transition-colors bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90"
            >
              {creating ? '...' : 'New doc'}
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-6 h-6'
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search & Sort */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-[#1c1c1f] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900 dark:text-white placeholder-slate-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-2 py-1.5 text-sm bg-transparent text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <option value="updated">Recently updated</option>
            <option value="created">Recently created</option>
            <option value="title">Alphabetically</option>
          </select>
        </div>

        {/* Header Row */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {searchQuery ? 'Search results' : 'Recent documents'}
          </span>
          {filteredAndSortedDocuments.length > 0 && (
            <span className="text-xs text-slate-400">{filteredAndSortedDocuments.length}</span>
          )}
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="space-y-0.5">
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-800 rounded max-w-xs" />
                <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : filteredAndSortedDocuments.length === 0 ? (
          <div className="text-center py-16">
            {searchQuery ? (
              <>
                <p className="text-sm text-slate-500">No documents found</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-slate-900 dark:text-white underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-4">No documents yet</p>
                <button
                  onClick={createDocument}
                  className="text-sm text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Create your first document
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
            {filteredAndSortedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1c1c1f] transition-colors group"
              >
                <a
                  href={`/editor/${doc.id}`}
                  className="flex-1 flex items-center gap-3 min-w-0"
                >
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="flex-1 text-sm text-slate-900 dark:text-white truncate group-hover:text-slate-700 dark:group-hover:text-slate-300">
                    {doc.title}
                  </span>
                  <span className="text-xs text-slate-400 tabular-nums flex-shrink-0">
                    {formatDate(doc.updatedAt)}
                  </span>
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteDocument(doc.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                  title="Delete document"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}