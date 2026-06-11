import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/guards';
import { setContentValue } from '@/lib/cms/storage';
import type { ContentKind } from '@/lib/cms/types';

export const runtime = 'nodejs';

interface BatchUpdate {
  key: string;
  value: string;
  kind: ContentKind;
}

export async function PATCH(request: Request) {
  const { session, response } = await requireAdminSession();
  if (response || !session) return response;

  const body = (await request.json()) as { updates?: BatchUpdate[] };
  if (!Array.isArray(body.updates) || body.updates.length === 0) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  for (const update of body.updates) {
    if (!update.key || typeof update.value !== 'string' || !update.kind) {
      return NextResponse.json({ error: 'Invalid update item' }, { status: 400 });
    }
    await setContentValue({
      key: update.key,
      value: update.value,
      kind: update.kind,
      updatedBy: session.email,
    });
  }

  return NextResponse.json({ ok: true, count: body.updates.length });
}
