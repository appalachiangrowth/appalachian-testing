import { NextResponse } from 'next/server';
import { signToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

/*
 * Admin login — env-var based auth (no database dependency).
 * Requires ADMIN_EMAIL, ADMIN_PASSWORD, and JWT_SECRET environment variables.
 */

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPass) {
      console.error('[Auth] ADMIN_EMAIL or ADMIN_PASSWORD not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ adminId: 'env-admin', email: adminEmail.toLowerCase() });

    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({
      success: true,
      user: { id: 'env-admin', email: adminEmail.toLowerCase(), name: 'Admin' },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
