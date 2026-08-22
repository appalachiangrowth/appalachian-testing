import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const items = await db.transformation.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const body = await request.json();
  const { client, metric, before, after, improvement, description, sortOrder, isPublished } = body;

  if (!client || !metric || !before || !after) {
    return NextResponse.json({ error: 'Client, metric, before, and after are required' }, { status: 400 });
  }

  const item = await db.transformation.create({
    data: {
      client,
      metric,
      before,
      after,
      improvement: improvement || '',
      description: description || '',
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}