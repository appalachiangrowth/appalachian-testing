import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') || '';

  try {
    const where: Record<string, unknown> = {};
    if (platform) where.platform = platform;

    const items = await db.platformImage.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('[Platform Images GET] DB error:', error);
    return NextResponse.json({ error: 'Database error', details: String((error as Error)?.message || '') }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  try {
    const body = await request.json();
    const { title, url, clientUrl, platform, sortOrder } = body;

    if (!title || !url || !platform) {
      return NextResponse.json({ error: 'Title, url, and platform are required' }, { status: 400 });
    }

    if (!['shopify', 'wordpress'].includes(platform)) {
      return NextResponse.json({ error: 'Platform must be "shopify" or "wordpress"' }, { status: 400 });
    }

    const item = await db.platformImage.create({
      data: {
        title: String(title),
        url: String(url),
        clientUrl: String(clientUrl || ''),
        platform: String(platform),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('[Platform Images POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create', details: String((error as Error)?.message || '') }, { status: 500 });
  }
}
