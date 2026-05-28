import { NextResponse } from 'next/server';
import { getContentValues } from '@/lib/cms/storage';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keysParam = searchParams.get('keys');
  if (!keysParam) {
    return NextResponse.json({ values: {} });
  }

  const keys = keysParam
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  const values = await getContentValues(keys);
  return NextResponse.json({ values });
}
