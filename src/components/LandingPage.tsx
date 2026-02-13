'use client';

import { useState, useEffect, useRef } from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useTheme } from '@/components/ThemeProvider';

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-[#101112] text-slate-900 dark:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#101112]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-900 dark:bg-white rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">CollabMD</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
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
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
            <SignInButton mode="modal">
              <button className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded transition-colors">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-2 py-1 text-xs font-medium rounded transition-colors bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90">
                Get started
              </button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-medium tracking-tight text-slate-900 dark:text-white mb-6">
              Markdown editing,<br />
              <span className="text-slate-400 dark:text-slate-500">reimagined.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              A collaborative markdown editor built for clarity. Write together in real-time without the distraction.
            </p>
            <SignUpButton mode="modal">
              <button className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
                Start writing free
              </button>
            </SignUpButton>
          </div>
        </div>

        {/* Editor Preview */}
        <div className="max-w-5xl mx-auto px-6 mt-16">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141414] overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-black/40">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-200 dark:border-slate-800/50">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800/50">
              {/* Editor */}
              <div className="p-6 font-mono text-sm">
                <div className="text-slate-400/80 mb-2"># Project Roadmap</div>
                <div className="text-slate-400/80 mb-1">## Q1</div>
                <div className="text-slate-700 dark:text-slate-300/90">- Launch beta</div>
                <div className="text-slate-700 dark:text-slate-300/90 ml-4 text-slate-500">→ Research complete</div>
                <div className="text-slate-700 dark:text-slate-300/90">- User research</div>
                <div className="text-slate-500/60 mt-1 animate-pulse">|</div>
              </div>
              {/* Preview */}
              <div className="p-6 prose prose-slate dark:prose-invert prose-sm max-w-none">
                <h1 className="!text-lg !font-medium !mb-2 text-slate-900 dark:text-white">Project Roadmap</h1>
                <h2 className="!text-base !font-normal !text-slate-500 !mb-1">Q1</h2>
                <ul className="!my-0">
                  <li className="text-slate-700 dark:text-slate-300">Launch beta <span className="text-green-500">✓</span></li>
                  <li className="text-slate-700 dark:text-slate-300">User research <span className="text-amber-500">→</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto px-6 mt-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-time sync',
                desc: 'See changes instantly as your team types. No merging, no conflicts.'
              },
              {
                title: 'Markdown native',
                desc: 'Clean, portable format that works with any tool or workflow.'
              },
              {
                title: 'Private by default',
                desc: 'Your docs are yours. End-to-end encryption available.'
              }
            ].map((feature, i) => (
              <div key={i}>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded-sm" />
            <span className="text-sm text-slate-500">CollabMD</span>
          </div>
          <p className="text-xs text-slate-400">Made for writers</p>
        </div>
      </footer>
    </div>
  );
}