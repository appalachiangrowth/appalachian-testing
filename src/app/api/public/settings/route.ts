import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const settings = await db.siteSetting.findMany();
  const kv: Record<string, string> = {};
  for (const s of settings) {
    kv[s.key] = s.value;
  }
  return NextResponse.json(kv);
}
