import 'server-only';

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'yx_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export interface AdminSessionPayload extends JWTPayload {
  email: string;
  role: 'admin';
}

function getSessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET ?? 'dev-only-change-this-secret';
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function verifyAdminSessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    if (payload.role !== 'admin' || typeof payload.email !== 'string') {
      return null;
    }

    return {
      email: payload.email,
      role: 'admin',
    };
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) return null;
  return verifyAdminSessionToken(token);
}
