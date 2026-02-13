'use client';

import { useState, useEffect, useRef } from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-amber-500/30">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 transition-transform duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
            transform: `translate(${mousePos.x * 100 - 50}px, ${mousePos.y * 100 - 50}px)`,
            left: '20%',
            top: '10%'
          }}
        />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 transition-transform duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)',
            transform: `translate(${-mousePos.x * 80 + 40}px, ${-mousePos.y * 80 + 40}px)`,
            right: '10%',
            bottom: '20%'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">CollabMD</span>
        </div>
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
              Get started
            </button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-8 pt-20 pb-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Real-time collaboration
            </div>

            <h1 className="text-7xl md:text-8xl font-bold leading-[0.95] tracking-tight mb-8">
              Write
              <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                together.
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-xl mb-12 leading-relaxed">
              A Markdown editor built for collaboration. See changes as they happen.
              No conflict resolution. No merge conflicts. Just smooth, synchronous writing.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 group">
                  <span className="flex items-center gap-2">
                    Start writing free
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
              </SignUpButton>
              <a href="#demo" className="px-8 py-4 border border-gray-700 rounded-xl font-medium text-gray-300 hover:border-gray-500 hover:text-white transition-colors">
                See how it works
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No credit card · 30 seconds setup · Free for individuals
            </p>
          </div>
        </section>

        {/* Demo Illustration */}
        <section id="demo" className="max-w-6xl mx-auto px-8 pb-32">
          <div className="relative">
            {/* Main editor window */}
            <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-gray-500 font-mono">document.md</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2">
                {/* User 1 */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                      A
                    </div>
                    <span className="text-sm text-gray-400">Alex</span>
                    <span className="text-xs text-blue-400 animate-pulse">typing...</span>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-gray-500"># Project Roadmap</div>
                    <div className="text-gray-500">## Q1 Goals</div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">Launch beta</span>
                      <span className="text-gray-600">—</span>
                      <span className="text-yellow-400">✓ Done</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">User research</span>
                      <span className="text-gray-600">—</span>
                      <span className="text-green-400 animate-pulse">In progress</span>
                    </div>
                    <div>
                      <span className="text-cyan-400 cursor-blink">|</span>
                      <span className="text-gray-500">Ship v1.0</span>
                    </div>
                  </div>
                </div>

                {/* User 2 */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                      S
                    </div>
                    <span className="text-sm text-gray-400">Sarah</span>
                    <span className="text-xs text-purple-400 animate-pulse">editing...</span>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-gray-500"># Project Roadmap</div>
                    <div className="text-gray-500">## Q1 Goals</div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">Launch beta</span>
                      <span className="text-gray-600">—</span>
                      <span className="text-yellow-400">✓ Done</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">User research</span>
                      <span className="text-gray-600">—</span>
                      <span className="text-green-400">In progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 cursor-blink">|</span>
                      <span className="text-gray-500">Ship v1.0</span>
                    </div>
                    <div className="text-purple-400">with real-time sync</div>
                  </div>
                </div>
              </div>

              {/* Sync indicator */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Synced</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-8 pb-32">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 bg-[#111] rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning fast</h3>
              <p className="text-gray-400 leading-relaxed">
                Changes appear instantly on all connected devices. No refreshing, no syncing delays, no conflicts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-[#111] rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Markdown native</h3>
              <p className="text-gray-400 leading-relaxed">
                Write in clean, portable Markdown. Export to HTML, PDF, or keep it in MD format forever.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-[#111] rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Private by default</h3>
              <p className="text-gray-400 leading-relaxed">
                Your docs, your rules. Secure authentication keeps everything protected and accessible only to you.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-6xl mx-auto px-8 pb-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Built for writers who collaborate</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { emoji: '📚', title: 'Notes', desc: 'Meeting notes' },
              { emoji: '📝', title: 'Docs', desc: 'Team documentation' },
              { emoji: '📄', title: 'Content', desc: 'Blog posts & articles' },
              { emoji: '💻', title: 'Code', desc: 'READMEs & specs' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-[#111] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <div className="font-medium mb-1">{item.title}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-medium">CollabMD</span>
          </div>
          <p className="text-sm text-gray-500">Write better, together.</p>
        </div>
      </footer>

      {/* Cursor blink animation */}
      <style jsx>{`
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}