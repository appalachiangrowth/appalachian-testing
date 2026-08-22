import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const items = await db.testimonial.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const body = await request.json();
  const { name, role, type, text, rating, sortOrder, isPublished } = body;

  if (!name || !text) {
    return NextResponse.json({ error: 'Name and text are required' }, { status: 400 });
  }

  const item = await db.testimonial.create({
    data: {
      name,
      role: role || '',
      type: type || '',
      text,
      rating: rating ?? 5,
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
