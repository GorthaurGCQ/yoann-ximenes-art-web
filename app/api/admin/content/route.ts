import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/guards';
import { getRecentLogs, setContentValue } from '@/lib/cms/storage';
import type { ContentKind } from '@/lib/cms/types';

export const runtime = 'nodejs';

interface UpdateContentBody {
  key?: string;
  value?: string;
  kind?: ContentKind;
}

export async function PATCH(request: Request) {
  const { session, response } = await requireAdminSession();
  if (response || !session) return response;

  const body = (await request.json()) as UpdateContentBody;
  if (!body.key || typeof body.value !== 'string' || !body.kind) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const entry = await setContentValue({
    key: body.key,
    value: body.value,
    kind: body.kind,
    updatedBy: session.email,
  });

  return NextResponse.json({ ok: true, entry });
}

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const logs = await getRecentLogs(100);
  return NextResponse.json({ logs });
}
