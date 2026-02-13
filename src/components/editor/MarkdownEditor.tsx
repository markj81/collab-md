'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState, type Extension } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { yCollab } from 'y-codemirror.next';
import * as Y from 'yjs';
import { useTheme } from '@/components/ThemeProvider';

interface MarkdownEditorProps {
  documentId: string;
  yText?: Y.Text;
  initialContent?: string;
  onChange?: (content: string) => void;
  onWordCountChange?: (words: number, chars: number) => void;
}

export function MarkdownEditor({
  documentId,
  yText,
  initialContent = '',
  onChange,
  onWordCountChange,
}: MarkdownEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const docIdRef = useRef<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleBold = useCallback(() => {
    const view = viewRef.current;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const selectedText = view.state.sliceDoc(from, to);
    const textToInsert = `**${selectedText}**`;
    view.dispatch({ changes: { from, to, insert: textToInsert } });
  }, []);

  const toggleItalic = useCallback(() => {
    const view = viewRef.current;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const selectedText = view.state.sliceDoc(from, to);
    const textToInsert = `*${selectedText}*`;
    view.dispatch({ changes: { from, to, insert: textToInsert } });
  }, []);

  const insertHeading = useCallback((level: number) => {
    const view = viewRef.current;
    if (!view) return;
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const prefix = '#'.repeat(level) + ' ';
    view.dispatch({ changes: { from: line.from, insert: prefix } });
  }, []);

  const insertList = useCallback((ordered: boolean) => {
    const view = viewRef.current;
    if (!view) return;
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const prefix = ordered ? '1. ' : '- ';
    view.dispatch({ changes: { from: line.from, insert: prefix } });
  }, []);

  const insertCodeBlock = useCallback(() => {
    const view = viewRef.current;
    if (!view) return;
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const prefix = '```\n';
    const suffix = '\n```';
    view.dispatch({ changes: { from: line.from, insert: prefix + suffix } });
  }, []);

  const insertLink = useCallback(() => {
    const view = viewRef.current;
    if (!view) return;
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const prefix = '[';
    const suffix = '](url)';
    view.dispatch({ changes: { from: line.from, insert: prefix + suffix } });
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = editorRef.current?.closest('.editor-container');
    if (!container) return;
    if (!isFullscreen) {
      container.classList.add('fixed', 'inset-0', 'z-50', 'bg-white', 'dark:bg-[#0a0a0a]', 'p-4');
    } else {
      container.classList.remove('fixed', 'inset-0', 'z-50', 'bg-white', 'dark:bg-[#0a0a0a]', 'p-4');
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    if (!editorRef.current) return;
    if (docIdRef.current === documentId) return;
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }
    docIdRef.current = documentId;
    const localYdoc = new Y.Doc();
    const ytext = yText || localYdoc.getText('codemirror');
    if (yText === undefined && ytext.toString() === '' && initialContent) {
      ytext.insert(0, initialContent);
    }

    const isDark = theme === 'dark';

    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLine(),
      history(),
      markdown(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
        if (onWordCountChange) {
          const text = update.state.doc.toString();
          const words = text.trim() ? text.trim().split(/\s+/).length : 0;
          const chars = text.length;
          onWordCountChange(words, chars);
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          backgroundColor: 'transparent',
          color: isDark ? '#e2e8f0' : '#0f172a',
        },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': {
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          backgroundColor: 'transparent',
          color: isDark ? '#e2e8f0' : '#0f172a',
        },
        '.cm-line': { padding: '0 16px', color: isDark ? '#e2e8f0' : '#0f172a' },
        '&.cm-focused': { outline: 'none' },
        '.cm-gutters': {
          backgroundColor: 'transparent',
          color: isDark ? '#64748b' : '#94a3b8',
          borderRight: '1px solid #334155',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'transparent',
          color: isDark ? '#f59e0b' : '#0f172a',
        },
        '.cm-activeLine': {
          backgroundColor: isDark ? '#1a1a1a' : '#f8fafc',
        },
        '.cm-selectionBackground, .cm-content ::selection': {
          backgroundColor: isDark ? '#f59e0b33' : '#e2e8f0',
        },
      }),
    ];

    if (yText !== undefined) {
      extensions.push(yCollab(yText, null) as Extension);
    }

    const state = EditorState.create({
      doc: ytext.toString() || initialContent,
      extensions,
    });

    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            toggleBold();
            break;
          case 'i':
            e.preventDefault();
            toggleItalic();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      docIdRef.current = null;
    };
  }, [documentId, yText, theme, onChange, onWordCountChange]);

  return (
    <div className={`editor-container flex flex-col h-full ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="toolbar sticky top-0 z-10 flex items-center gap-1 px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] flex-wrap">
        <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-slate-700">
          <button onClick={toggleBold} className="px-2 py-1 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">Bold</button>
          <button onClick={toggleItalic} className="px-2 py-1 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors italic">Italic</button>
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-slate-700">
          <button onClick={() => insertHeading(1)} className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">H1</button>
          <button onClick={() => insertHeading(2)} className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">H2</button>
          <button onClick={() => insertHeading(3)} className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">H3</button>
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-slate-700">
          <button onClick={() => insertList(false)} className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">List</button>
          <button onClick={() => insertList(true)} className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">Ordered</button>
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-slate-700">
          <button onClick={insertCodeBlock} className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">&lt;/&gt;</button>
          <button onClick={insertLink} className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">Link</button>
        </div>
        <div className="flex items-center gap-0.5 px-2">
          <button onClick={toggleFullscreen} className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>
      <div ref={editorRef} className="flex-1 overflow-auto" />
    </div>
  );
}