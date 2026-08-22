import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json();
  const { type } = body;

  if (type === 'seo') {
    const existing = await db.seoResultImage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const item = await db.seoResultImage.update({ where: { id }, data: { ...(body.title !== undefined && { title: body.title }), ...(body.url !== undefined && { url: body.url }), ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }) } });
    return NextResponse.json(item);
  }

  const existing = await db.heroScreenshot.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const item = await db.heroScreenshot.update({
    where: { id },
    data: {
      ...(body.category !== undefined && { category: body.category }),
      ...(body.url !== undefined && { url: body.url }),
      ...(body.alt !== undefined && { alt: body.alt }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type === 'seo') {
    const existing = await db.seoResultImage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await db.seoResultImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  const existing = await db.heroScreenshot.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await db.heroScreenshot.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
