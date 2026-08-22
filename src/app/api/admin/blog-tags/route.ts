import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const tags = await db.blogTag.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const body = await request.json();
  const { name } = body;
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const slug = slugify(name);
  const tag = await db.blogTag.create({ data: { name: name.trim(), slug } });
  return NextResponse.json(tag, { status: 201 });
}