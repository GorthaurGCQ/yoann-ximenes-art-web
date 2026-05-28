import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/guards';
import { getCmsCatalog } from '@/lib/cms/catalog';

export const runtime = 'nodejs';

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const items = await getCmsCatalog();
  return NextResponse.json({ items });
}
