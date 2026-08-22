import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  try {
    const items = await db.seoResultImage.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('[SEO Images GET] DB error:', error);
    return NextResponse.json({ error: 'Database error', details: String((error as Error)?.message || '') }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  try {
    const body = await request.json();
    const { title, url, sortOrder } = body;

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and url are required' }, { status: 400 });
    }

    const item = await db.seoResultImage.create({
      data: {
        title: String(title),
        url: String(url),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('[SEO Images POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create', details: String((error as Error)?.message || '') }, { status: 500 });
  }
}
