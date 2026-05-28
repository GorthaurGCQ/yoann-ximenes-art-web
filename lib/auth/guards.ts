import 'server-only';

import { NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth/session';

export async function requireAdminSession() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { session, response: null };
}
