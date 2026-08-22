import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const [services, metrics] = await Promise.all([
    db.marketingService.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.marketingMetric.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return NextResponse.json({ services, metrics });
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const body = await request.json();
  const { type } = body;

  if (type === 'metric') {
    const { metric, before, after, increase, sortOrder } = body;
    if (!metric || !before || !after) {
      return NextResponse.json({ error: 'Metric, before, and after are required' }, { status: 400 });
    }
    const item = await db.marketingMetric.create({
      data: { metric, before, after, increase: increase || '', sortOrder: sortOrder ?? 0 },
    });
    return NextResponse.json(item, { status: 201 });
  }

  // Default: create service
  const { title, description, stat, icon, sortOrder, isPublished } = body;
  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }
  const item = await db.marketingService.create({
    data: {
      title,
      description,
      stat: stat || '',
      icon: icon || '',
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
