'use client';

import { useEffect, useRef } from 'react';
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
}

export function MarkdownEditor({
  documentId,
  yText,
  initialContent = '',
  onChange,
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const docIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Skip if already initialized for this document
    if (docIdRef.current === documentId) return;

    // Clean up previous view
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    docIdRef.current = documentId;

    // Use the provided yText, or create a local ydoc for standalone mode
    const localYdoc = new Y.Doc();
    const ytext = yText || localYdoc.getText('codemirror');

    // Initialize with content if ytext is empty (standalone mode only)
    if (yText === undefined && ytext.toString() === '' && initialContent) {
      ytext.insert(0, initialContent);
    }

    // Create CodeMirror editor
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
      }),
      EditorView.theme({
        '&': { height: '100%' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { fontFamily: 'var(--font-mono)', fontSize: '14px' },
        '.cm-line': { padding: '0 16px' },
      }),
    ];

    // Add Y.js collaboration only when yText is provided (collaboration mode)
    if (yText !== undefined) {
      extensions.push(yCollab(yText, null) as Extension);
    }

    const state = EditorState.create({
      doc: ytext.toString() || initialContent,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      docIdRef.current = null;
    };
  }, [documentId, yText]); // Note: initialContent and onChange not in deps to avoid re-renders

  return <div ref={editorRef} className="h-full w-full" />;
}