import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json();

  const existing = await db.contactSubmission.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  const item = await db.contactSubmission.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;

  const existing = await db.contactSubmission.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  await db.contactSubmission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}