'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState, type Extension } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { yCollab } from 'y-codemirror.next';
import * as Y from 'yjs';

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
      container.classList.add('fixed', 'inset-0', 'z-50', 'bg-white', 'p-4');
    } else {
      container.classList.remove('fixed', 'inset-0', 'z-50', 'bg-white', 'p-4');
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
        '&': { height: '100%', backgroundColor: 'transparent' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { fontFamily: 'var(--font-mono)', fontSize: '14px', backgroundColor: 'transparent' },
        '.cm-line': { padding: '0 16px' },
        '&.cm-focused': { outline: 'none' },
        '.cm-gutters': {
          backgroundColor: 'transparent',
          color: '#94a3b8',
          borderRight: '1px solid #334155',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'transparent',
          color: '#f8fafc',
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
  }, [documentId, yText, onChange, onWordCountChange]);

  return (
    <div className="editor-container flex flex-col h-full">
      <div className="toolbar flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1a1a] flex-wrap">
        <div className="flex items-center gap-0.5 pr-2 border-r border-slate-300 dark:border-slate-600">
          <button onClick={toggleBold} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded font-bold text-sm text-slate-700 dark:text-slate-300">B</button>
          <button onClick={toggleItalic} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded italic text-sm text-slate-700 dark:text-slate-300">I</button>
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-300 dark:border-slate-600">
          <button onClick={() => insertHeading(1)} className="px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300">H1</button>
          <button onClick={() => insertHeading(2)} className="px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300">H2</button>
          <button onClick={() => insertHeading(3)} className="px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300">H3</button>
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-300 dark:border-slate-600">
          <button onClick={() => insertList(false)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm text-slate-700 dark:text-slate-300">- List</button>
          <button onClick={() => insertList(true)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm text-slate-700 dark:text-slate-300">1. List</button>
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-300 dark:border-slate-600">
          <button onClick={insertCodeBlock} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><code className="text-xs text-slate-700 dark:text-slate-300">&lt;/&gt;</code></button>
          <button onClick={insertLink} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm text-slate-700 dark:text-slate-300">Link</button>
        </div>
        <div className="flex items-center gap-0.5 px-2">
          <button onClick={toggleFullscreen} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm text-slate-700 dark:text-slate-300">{isFullscreen ? 'Exit Full' : 'Full'}</button>
        </div>
      </div>
      <div ref={editorRef} className="flex-1 overflow-auto" />
    </div>
  );
}
