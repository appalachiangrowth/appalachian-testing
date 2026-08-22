import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json();
  const { type } = body;

  if (type === 'screenshot') {
    const { category, url, alt, sortOrder } = body;
    const existing = await db.heroScreenshot.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
    }
    const item = await db.heroScreenshot.update({
      where: { id },
      data: { ...(category !== undefined && { category }), ...(url !== undefined && { url }), ...(alt !== undefined && { alt }), ...(sortOrder !== undefined && { sortOrder }) },
    });
    return NextResponse.json(item);
  }

  // Default: update stat
  const { value, label, target, suffix, isStatic, sortOrder } = body;
  const existing = await db.heroStat.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Hero stat not found' }, { status: 404 });
  }
  const item = await db.heroStat.update({
    where: { id },
    data: { ...(value !== undefined && { value }), ...(label !== undefined && { label }), ...(target !== undefined && { target }), ...(suffix !== undefined && { suffix }), ...(isStatic !== undefined && { isStatic }), ...(sortOrder !== undefined && { sortOrder }) },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type === 'screenshot') {
    const existing = await db.heroScreenshot.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
    }
    await db.heroScreenshot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  const existing = await db.heroStat.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Hero stat not found' }, { status: 404 });
  }
  await db.heroStat.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
