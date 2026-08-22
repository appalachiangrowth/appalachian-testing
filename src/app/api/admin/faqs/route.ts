import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const items = await db.fAQ.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const body = await request.json();
  const { question, answer, sortOrder, isPublished } = body;

  if (!question || !answer) {
    return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
  }

  const item = await db.fAQ.create({
    data: {
      question,
      answer,
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
