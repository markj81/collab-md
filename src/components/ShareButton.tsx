'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from './Toast';

interface ShareButtonProps {
  shareUrl: string;
  documentTitle: string;
  documentId: string;
  initialIsPublic?: boolean;
  initialPermission?: 'read-only' | 'editable';
}

export function ShareButton({
  shareUrl,
  documentTitle,
  documentId,
  initialIsPublic = false,
  initialPermission = 'editable',
}: ShareButtonProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPublic, setIsPublic] = useState(initialIsPublic ?? false);
  const [permission, setPermission] = useState(initialPermission);
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for modal
  useEffect(() => {
    if (showModal) {
      // Focus close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 50);
      // Trap focus in modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowModal(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showModal]);

  const handleCopy = async () => {
    const fullUrl = `${window.location.origin}/share/${shareUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisibilityChange = async (value: string) => {
    const newIsPublic = value === 'public';
    setIsPublic(newIsPublic);

    // If switching to public, set read-only
    if (newIsPublic) {
      setPermission('read-only');
    }

    setSaving(true);
    try {
      await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublic: newIsPublic,
          sharePermission: newIsPublic ? 'read-only' : permission,
        }),
      });
      showToast(`Document is now ${newIsPublic ? 'public' : 'private'}`, 'success');
    } catch (err) {
      console.error('Error updating visibility:', err);
      showToast('Failed to update visibility', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePermissionChange = async (value: string) => {
    setPermission(value as 'read-only' | 'editable');
    setSaving(true);
    try {
      await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic, sharePermission: value }),
      });
      showToast('Permission updated', 'success');
    } catch (err) {
      console.error('Error updating permission:', err);
      showToast('Failed to update permission', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fullShareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${shareUrl}` : '';

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-colors',
          'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-[#1a1a1b] rounded-xl p-6 max-w-md w-full shadow-2xl animate-fade-in"
            style={{ margin: 'auto' }}
          >
            {/* Header with title and close button */}
            <div className="flex items-center justify-between mb-6">
              <h3 id="share-dialog-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                Share document
              </h3>
              <button
                ref={closeButtonRef}
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                aria-label="Close share dialog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Public / Private selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Who can view
              </label>
              <div className="flex gap-3">
                <label
                  className={cn(
                    'flex-1 flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all',
                    !isPublic
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={!isPublic}
                      onChange={() => handleVisibilityChange('private')}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Private
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                    Requires login to view
                  </span>
                </label>
                <label
                  className={cn(
                    'flex-1 flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all',
                    isPublic
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={isPublic}
                      onChange={() => handleVisibilityChange('public')}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Public
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                    Anyone with link can view
                  </span>
                </label>
              </div>
            </div>

            {/* Permission level - only for Private */}
            {isPublic === false && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Permission level
                </label>
                <div className="flex gap-3">
                  <label
                    className={cn(
                      'flex-1 flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all',
                      permission === 'read-only'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="permission"
                        value="read-only"
                        checked={permission === 'read-only'}
                        onChange={() => handlePermissionChange('read-only')}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Read-only
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                      Viewers cannot edit
                    </span>
                  </label>
                  <label
                    className={cn(
                      'flex-1 flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all',
                      permission === 'editable'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="permission"
                        value="editable"
                        checked={permission === 'editable'}
                        onChange={() => handlePermissionChange('editable')}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Editable
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                      Viewers can edit
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Saving indicator */}
            {saving && (
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                Saving...
              </div>
            )}

            {/* Share Link */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Share link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={fullShareUrl}
                  onClick={(e) => e.currentTarget.select()}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400"
                  aria-label="Share link URL"
                />
                <a
                  href={fullShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  aria-label="Open share link in new tab"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={handleCopy}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                  aria-label={copied ? 'Copied to clipboard' : 'Copy link to clipboard'}
                >
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
