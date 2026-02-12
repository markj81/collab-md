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
        'prose prose-slate max-w-none p-4 h-full overflow-auto',
        'prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
        'prose-p:leading-relaxed prose-p:text-slate-700',
        'prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-slate-800',
        'prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:p-4 prose-pre:rounded-lg',
        'prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800',
        'prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic',
        'prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6',
        'prose-img:rounded-lg prose-img:shadow-md',
        className
      )}
    >
      <ReactMarkdown>{content || '*No content yet...*'}</ReactMarkdown>
    </div>
  );
}