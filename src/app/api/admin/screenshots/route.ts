import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const [hero, seo] = await Promise.all([
    db.heroScreenshot.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.seoResultImage.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return NextResponse.json({ heroScreenshots: hero, seoImages: seo });
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const body = await request.json();
  const { type, category, title, url, alt, sortOrder } = body;

  if (type === 'seo') {
    if (!title || !url) {
      return NextResponse.json({ error: 'Title and url are required' }, { status: 400 });
    }
    const item = await db.seoResultImage.create({
      data: { title, url, sortOrder: sortOrder ?? 0 },
    });
    return NextResponse.json(item, { status: 201 });
  }

  // Hero screenshot
  if (!category || !url) {
    return NextResponse.json({ error: 'Category and url are required' }, { status: 400 });
  }
  const item = await db.heroScreenshot.create({
    data: { category, url, alt: alt || '', sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(item, { status: 201 });
}
