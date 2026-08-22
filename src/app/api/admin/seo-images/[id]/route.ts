import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.seoResultImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'SEO result image not found' }, { status: 404 });
    }

    const item = await db.seoResultImage.update({
      where: { id },
      data: {
        title: body.title !== undefined ? String(body.title) : undefined,
        url: body.url !== undefined ? String(body.url) : undefined,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('[SEO Images PUT] Error:', error);
    return NextResponse.json({ error: 'Failed to update', details: String((error as Error)?.message || '') }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  try {
    const { id } = await params;

    const existing = await db.seoResultImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'SEO result image not found' }, { status: 404 });
    }

    await db.seoResultImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SEO Images DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete', details: String((error as Error)?.message || '') }, { status: 500 });
  }
}
