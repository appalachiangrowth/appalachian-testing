import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const stats = await db.heroStat.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const body = await request.json();
  const { value, label, target, suffix, isStatic, sortOrder } = body;
  if (!value || !label) {
    return NextResponse.json({ error: 'Value and label required' }, { status: 400 });
  }
  const item = await db.heroStat.create({
    data: { value, label, target: target ?? 0, suffix: suffix ?? '', isStatic: isStatic ?? false, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(item, { status: 201 });
}
