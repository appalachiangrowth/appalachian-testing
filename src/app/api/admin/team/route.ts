import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const items = await db.teamMember.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const body = await request.json();
  const { name, role, bio, initials, websiteUrl, linkedinUrl, githubUrl, sortOrder, isPublished } = body;

  if (!name || !role || !bio) {
    return NextResponse.json({ error: 'Name, role, and bio are required' }, { status: 400 });
  }

  const item = await db.teamMember.create({
    data: {
      name,
      role,
      bio,
      initials: initials || name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      websiteUrl: websiteUrl || '#',
      linkedinUrl: linkedinUrl || '#',
      githubUrl: githubUrl || '#',
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
