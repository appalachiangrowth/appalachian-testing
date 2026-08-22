import { cookies } from 'next/headers';
import { verifyToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export function adminUnauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
