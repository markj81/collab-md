'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/components/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#f59e0b',
          colorBackground: '#ffffff',
          colorText: '#0f172a',
          colorInputBackground: '#f8fafc',
          colorInputText: '#0f172a',
        },
        elements: {
          formButtonPrimary: 'bg-amber-500 hover:bg-amber-600 text-white',
          card: 'bg-white shadow-xl',
          headerTitle: 'text-slate-900',
          headerSubtitle: 'text-slate-600',
          socialButtonsBlockButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
          formFieldLabel: 'text-slate-700',
          formFieldInput: 'border-slate-300 focus:border-amber-500 focus:ring-amber-500',
          identityPreviewText: 'text-slate-700',
          identityPreviewEditButton: 'text-amber-600',
          footerActionLink: 'text-amber-600 hover:text-amber-700',
        },
      }}
    >
      <ThemeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}