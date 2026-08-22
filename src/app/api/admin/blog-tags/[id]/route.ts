import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const { id } = await params;
  const body = await request.json();
  function slugify(t: string) { return t.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(); }
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) { data.name = body.name; data.slug = slugify(body.name); }
  const tag = await db.blogTag.update({ where: { id }, data });
  return NextResponse.json(tag);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();
  const { id } = await params;
  await db.blogTag.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
