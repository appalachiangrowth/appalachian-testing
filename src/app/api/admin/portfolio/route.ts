import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const items = await db.portfolioItem.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const body = await request.json();
  const { name, industry, platform, description, accentColor, secondaryColor, image, url, challenge, solution, result, sortOrder, isPublished } = body;

  if (!name || !description || !image) {
    return NextResponse.json({ error: 'Name, description, and image are required' }, { status: 400 });
  }

  const item = await db.portfolioItem.create({
    data: {
      name,
      industry: industry || '',
      platform: platform || '',
      description,
      accentColor: accentColor || '#B6FF00',
      secondaryColor: secondaryColor || '#1a1a2e',
      image,
      url: url || '',
      challenge: challenge || '',
      solution: solution || '',
      result: result || '',
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
