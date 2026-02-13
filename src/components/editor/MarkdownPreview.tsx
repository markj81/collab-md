'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none p-4 h-full overflow-auto',
        'prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
        'prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300',
        'prose-code:bg-slate-100 dark:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-slate-800 dark:prose-code:text-slate-200',
        'prose-pre:bg-slate-900 dark:prose-pre:bg-[#1a1a1a] prose-pre:text-slate-50 prose-pre:p-4 prose-pre:rounded-lg',
        'prose-a:text-blue-600 dark:prose-a:text-amber-500 prose-a:underline hover:prose-a:text-blue-800 dark:hover:prose-a:text-amber-400',
        'prose-blockquote:border-l-4 prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400',
        'prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6',
        'prose-img:rounded-lg prose-img:shadow-md',
        'prose-th:text-slate-900 dark:prose-th:text-white prose-th:bg-slate-100 dark:prose-th:bg-slate-800',
        'prose-td:text-slate-700 dark:prose-td:text-slate-300',
        'prose-hr:border-slate-200 dark:prose-hr:border-slate-700',
        className
      )}
    >
      <ReactMarkdown>{content || '*No content yet...*'}</ReactMarkdown>
    </div>
  );
}