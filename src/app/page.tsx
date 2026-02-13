'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { DocumentList } from '@/components/DocumentList';
import { DocumentListItem } from '@/types';
import { formatDate } from '@/lib/utils';

type SortOption = 'updated' | 'created' | 'title';

export default function Home() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...documents];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc =>
        doc.title.toLowerCase().includes(query)
      );
    }

    // Sort
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
    if (!confirm('Are you sure you want to delete this document?')) return;
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

  // Keyboard shortcut for new document
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N for new document
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (!creating) {
          createDocument();
        }
      }
      // Ctrl/Cmd + / for focus search
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [creating]);

  // Loading skeleton component
  const DocumentSkeleton = () => (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg animate-pulse">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-slate-200 rounded-md" />
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-1/4" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-slate-200 rounded" />
        <div className="w-8 h-8 bg-slate-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-xl font-semibold text-slate-900">CollabMD</h1>
          </div>
          <button
            onClick={createDocument}
            disabled={creating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {creating ? 'Creating...' : 'New Document'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search and Sort */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="search-input"
              type="text"
              placeholder="Search documents... (Ctrl+/)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900">
            {searchQuery ? `Search Results (${filteredAndSortedDocuments.length})` : 'Recent Documents'}
          </h2>
          {filteredAndSortedDocuments.length > 0 && (
            <span className="text-sm text-slate-500">{documents.length} document{documents.length !== 1 ? 's' : ''} total</span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-3">
            <DocumentSkeleton />
            <DocumentSkeleton />
            <DocumentSkeleton />
          </div>
        ) : filteredAndSortedDocuments.length === 0 ? (
          <div className="text-center py-16">
            {searchQuery ? (
              <>
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg text-slate-600 mb-2">No documents found</p>
                <p className="text-sm text-slate-500 mb-4">Try a different search term</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <svg className="w-20 h-20 mx-auto mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xl font-medium text-slate-600 mb-2">No documents yet</p>
                <p className="text-slate-500 mb-6">Create your first document to get started</p>
                <button
                  onClick={createDocument}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Document
                </button>
                <p className="mt-4 text-xs text-slate-400">
                  Keyboard shortcut: Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Ctrl + N</kbd> to create a new document
                </p>
              </>
            )}
          </div>
        ) : (
          <DocumentList documents={filteredAndSortedDocuments} onDelete={deleteDocument} />
        )}
      </main>
    </div>
  );
}