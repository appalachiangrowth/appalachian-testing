import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const { id } = await params;
  const body = await request.json();
  const { name, description, sortOrder } = body;
  const data: Record<string, unknown> = {};
  if (name !== undefined) { data.name = name; data.slug = slugify(name); }
  if (description !== undefined) data.description = description;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;
  const category = await db.blogCategory.update({ where: { id }, data });
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const { id } = await params;
  await db.blogCategory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
