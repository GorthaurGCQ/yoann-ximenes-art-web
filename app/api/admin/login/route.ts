import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { canAttemptLogin } from '@/lib/auth/rate-limit';
import { verifyAdminPassword } from '@/lib/auth/password';
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from '@/lib/auth/session';

export const runtime = 'nodejs';

interface LoginBody {
  email?: string;
  password?: string;
}

function getClientIp(ipHeader: string | null): string {
  if (!ipHeader) return 'unknown';
  return ipHeader.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? '';

  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hasPasswordConfig = Boolean(process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH);
  if (!expectedEmail || !hasPasswordConfig) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured on the server.' },
      { status: 500 }
    );
  }

  const headerStore = await headers();
  const ip = getClientIp(headerStore.get('x-forwarded-for'));
  if (!canAttemptLogin(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again in a few minutes.' },
      { status: 429 }
    );
  }

  if (!email || email !== expectedEmail) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const passwordOk = await verifyAdminPassword(password);
  if (!passwordOk) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createAdminSessionToken({ email, role: 'admin' });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
