import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const hasKvUrl = !!process.env.KV_URL;
  const kvUrlPreview = process.env.KV_URL
    ? `${process.env.KV_URL.substring(0, 20)}...`
    : 'not set';

  return NextResponse.json({
    kvUrlConfigured: hasKvUrl,
    kvUrlPreview,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL,
  });
}