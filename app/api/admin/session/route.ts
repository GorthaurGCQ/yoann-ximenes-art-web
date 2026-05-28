import { NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth/session';

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ isAdmin: false });
  }

  return NextResponse.json({ isAdmin: true, email: session.email });
}
