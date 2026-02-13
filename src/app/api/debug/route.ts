import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const kvUrl = process.env.KV_URL || process.env.REDIS_URL;
  const hasKvUrl = !!kvUrl;

  return NextResponse.json({
    kvUrlConfigured: hasKvUrl,
    kvUrlPreview: kvUrl ? `${kvUrl.substring(0, 30)}...` : 'not set',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL,
    allEnvVars: Object.keys(process.env).filter(k => k.includes('KV') || k.includes('REDIS')),
  });
}