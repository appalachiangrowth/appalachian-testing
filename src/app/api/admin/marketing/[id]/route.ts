import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json();
  const { type } = body;

  if (type === 'metric') {
    const { metric, before, after, increase, sortOrder } = body;
    const existing = await db.marketingMetric.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Marketing metric not found' }, { status: 404 });
    }
    const item = await db.marketingMetric.update({
      where: { id },
      data: { ...(metric !== undefined && { metric }), ...(before !== undefined && { before }), ...(after !== undefined && { after }), ...(increase !== undefined && { increase }), ...(sortOrder !== undefined && { sortOrder }) },
    });
    return NextResponse.json(item);
  }

  // Default: update service
  const existing = await db.marketingService.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Marketing service not found' }, { status: 404 });
  }
  const { title, description, stat, icon, sortOrder, isPublished } = body;
  const item = await db.marketingService.update({
    where: { id },
    data: { ...(title !== undefined && { title }), ...(description !== undefined && { description }), ...(stat !== undefined && { stat }), ...(icon !== undefined && { icon }), ...(sortOrder !== undefined && { sortOrder }), ...(isPublished !== undefined && { isPublished }) },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type === 'metric') {
    const existing = await db.marketingMetric.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Marketing metric not found' }, { status: 404 });
    }
    await db.marketingMetric.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  const existing = await db.marketingService.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Marketing service not found' }, { status: 404 });
  }
  await db.marketingService.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
