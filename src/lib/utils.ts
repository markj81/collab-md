import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: unknown): string {
  if (date == null) return 'Unknown';

  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'number' || typeof date === 'string') {
    d = new Date(date);
  } else {
    return 'Unknown';
  }

  if (isNaN(d.getTime())) return 'Unknown';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}