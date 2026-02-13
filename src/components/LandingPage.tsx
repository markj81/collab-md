'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Write Together, <span className="text-blue-600">Create Better</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          CollabMD is the real-time collaborative Markdown editor that helps teams and individuals write better content, together.
        </p>
        <div className="flex items-center justify-center gap-4">
          <SignUpButton mode="modal">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
              Start Free
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-lg">
              Sign In
            </button>
          </SignInButton>
        </div>
      </section>

      {/* Collaboration Illustration */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <svg className="w-full h-auto" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background */}
            <rect width="800" height="400" fill="#f8fafc" rx="16"/>

            {/* Editor Window 1 - User 1 */}
            <rect x="40" y="40" width="340" height="280" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
            <rect x="40" y="40" width="340" height="32" rx="12" fill="#f1f5f9"/>
            <rect x="40" y="60" width="340" height="12" fill="#f1f5f9"/>
            <circle cx="60" cy="56" r="6" fill="#ef4444"/>
            <circle cx="80" cy="56" r="6" fill="#f59e0b"/>
            <circle cx="100" cy="56" r="6" fill="#22c55e"/>
            {/* Cursor 1 */}
            <rect x="80" y="120" width="2" height="20" fill="#3b82f6">
              <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
            </rect>
            <text x="90" y="135" fontFamily="monospace" fontSize="12" fill="#64748b"># Heading</text>
            <text x="80" y="155" fontFamily="monospace" fontSize="11" fill="#94a3b8">Collaborative</text>
            <text x="80" y="170" fontFamily="monospace" fontSize="11" fill="#94a3b8">editing in</text>
            <text x="80" y="185" fontFamily="monospace" fontSize="11" fill="#94a3b8">real-time</text>
            {/* User Avatar 1 */}
            <circle cx="320" y="80" r="16" fill="#3b82f6"/>
            <text x="320" y="85" textAnchor="middle" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold">A</text>

            {/* Editor Window 2 - User 2 */}
            <rect x="420" y="40" width="340" height="280" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
            <rect x="420" y="40" width="340" height="32" rx="12" fill="#f1f5f9"/>
            <rect x="420" y="60" width="340" height="12" fill="#f1f5f9"/>
            <circle cx="440" cy="56" r="6" fill="#ef4444"/>
            <circle cx="460" cy="56" r="6" fill="#f59e0b"/>
            <circle cx="480" cy="56" r="6" fill="#22c55e"/>
            {/* Cursor 2 */}
            <rect x="180" y="120" width="2" height="20" fill="#22c55e">
              <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>
            </rect>
            <text x="190" y="135" fontFamily="monospace" fontSize="12" fill="#64748b"># Heading</text>
            <text x="180" y="155" fontFamily="monospace" fontSize="11" fill="#22c55e">**Collaborative**</text>
            <text x="180" y="170" fontFamily="monospace" fontSize="11" fill="#94a3b8">editing in</text>
            <text x="180" y="185" fontFamily="monospace" fontSize="11" fill="#94a3b8">real-time</text>
            {/* User Avatar 2 */}
            <circle cx="700" cy="80" r="16" fill="#22c55e"/>
            <text x="700" y="85" textAnchor="middle" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold">B</text>

            {/* Connection Lines */}
            <path d="M380 160 Q400 160 420 160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite"/>
            </path>

            {/* Labels */}
            <text x="210" y="360" textAnchor="middle" fontFamily="Arial" fontSize="14" fill="#64748b">You</text>
            <text x="590" y="360" textAnchor="middle" fontFamily="Arial" fontSize="14" fill="#64748b">Teammate</text>
          </svg>
          <p className="text-center text-sm text-slate-500 mt-4">
            See changes instantly as your team collaborates
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Why CollabMD?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-Time Collaboration</h3>
            <p className="text-slate-600">
              Work simultaneously with your team. See cursors, edits, and changes instantly as they happen.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Markdown Powered</h3>
            <p className="text-slate-600">
              Write in plain Markdown, export anywhere. Clean, portable, and version-control friendly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Private by Default</h3>
            <p className="text-slate-600">
              Your documents are yours. Secure authentication keeps your content safe and accessible only to you.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-medium text-slate-900">Documentation</h4>
              <p className="text-sm text-slate-500">Team docs, wikis, guides</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-medium text-slate-900">Notes</h4>
              <p className="text-sm text-slate-500">Meeting notes, study materials</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-2xl mb-2">📄</div>
              <h4 className="font-medium text-slate-900">Content</h4>
              <p className="text-sm text-slate-500">Blog posts, articles, manuals</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-2xl mb-2">💻</div>
              <h4 className="font-medium text-slate-900">Code Docs</h4>
              <p className="text-sm text-slate-500"> READMEs, technical specs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Ready to collaborate better?
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Start writing with your team today. Free for individuals, powerful for teams.
        </p>
        <SignUpButton mode="modal">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
            Create Free Account
          </button>
        </SignUpButton>
        <p className="mt-4 text-sm text-slate-500">
          No credit card required · 30-second setup
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-slate-700">CollabMD</span>
          </div>
          <p className="text-sm text-slate-500">
            Real-time collaborative Markdown editor
          </p>
        </div>
      </footer>
    </div>
  );
}