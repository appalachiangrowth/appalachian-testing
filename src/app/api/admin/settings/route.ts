import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const settings = await db.siteSetting.findMany();
  const kv: Record<string, string> = {};
  for (const s of settings) {
    kv[s.key] = s.value;
  }
  return NextResponse.json(kv);
}

export async function PUT(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const body = await request.json();
  const results: Record<string, string> = {};

  for (const [key, value] of Object.entries(body)) {
    const setting = await db.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
    results[setting.key] = setting.value;
  }

  return NextResponse.json(results);
}