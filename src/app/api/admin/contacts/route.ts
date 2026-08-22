import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const contacts = await db.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(contacts);
}

export async function DELETE(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const url = new URL(request.url);
  const ids = url.searchParams.get('ids');

  if (ids) {
    const idList = ids.split(',');
    await db.contactSubmission.deleteMany({
      where: { id: { in: idList } },
    });
    return NextResponse.json({ success: true, deleted: idList.length });
  }

  return NextResponse.json({ error: 'Provide ids query param to delete' }, { status: 400 });
}
