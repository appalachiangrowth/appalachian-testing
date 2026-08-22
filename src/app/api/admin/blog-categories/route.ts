import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const categories = await db.blogCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const body = await request.json();
  const { name, description, sortOrder } = body;
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const slug = slugify(name);
  const category = await db.blogCategory.create({
    data: { name, slug, description: description || null, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(category, { status: 201 });
}