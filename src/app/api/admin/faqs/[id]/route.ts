import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json();

  const existing = await db.fAQ.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  }

  const item = await db.fAQ.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;

  const existing = await db.fAQ.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  }

  await db.fAQ.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
