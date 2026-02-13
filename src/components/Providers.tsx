'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/components/Toast';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#2563eb',
          colorBackground: '#ffffff',
          colorText: '#0f172a',
          colorInputBackground: '#f8fafc',
          colorInputText: '#0f172a',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'bg-white shadow-xl',
          headerTitle: 'text-slate-900',
          headerSubtitle: 'text-slate-600',
          socialButtonsBlockButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
          formFieldLabel: 'text-slate-700',
          formFieldInput: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500',
          identityPreviewText: 'text-slate-700',
          identityPreviewEditButton: 'text-blue-600',
          footerActionLink: 'text-blue-600 hover:text-blue-700',
        },
      }}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </ClerkProvider>
  );
}