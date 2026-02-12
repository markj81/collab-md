'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { DocumentListItem } from '@/types';

interface DocumentListProps {
  documents: DocumentListItem[];
  onDelete?: (id: string) => void;
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No documents yet</p>
        <p className="text-sm mt-1">Create your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <Link
            href={`/editor/${doc.id}`}
            className="flex-1 flex items-center gap-3 min-w-0"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{doc.title}</p>
              <p className="text-sm text-slate-500">Updated {formatDate(doc.updatedAt)}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/editor/${doc.id}`}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(doc.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}