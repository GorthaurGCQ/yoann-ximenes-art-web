import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/guards';

export const runtime = 'nodejs';

interface TranslateBody {
  text?: string;
  sourceLang?: 'FR' | 'EN';
  targetLang?: 'FR' | 'EN';
}

export async function POST(request: Request) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const body = (await request.json()) as TranslateBody;
  const text = body.text?.trim();
  const sourceLang = body.sourceLang;
  const targetLang = body.targetLang;

  if (!text || !sourceLang || !targetLang || sourceLang === targetLang) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'DEEPL_API_KEY is missing' }, { status: 500 });
  }

  const endpoint = process.env.DEEPL_API_URL ?? 'https://api-free.deepl.com/v2/translate';
  const params = new URLSearchParams();
  params.set('text', text);
  params.set('source_lang', sourceLang);
  params.set('target_lang', targetLang);

  const deeplResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!deeplResponse.ok) {
    const errorText = await deeplResponse.text();
    return NextResponse.json({ error: `DeepL error: ${errorText}` }, { status: 502 });
  }

  const data = (await deeplResponse.json()) as {
    translations?: Array<{ text?: string }>;
  };

  const translatedText = data.translations?.[0]?.text;
  if (!translatedText) {
    return NextResponse.json({ error: 'No translation returned' }, { status: 502 });
  }

  return NextResponse.json({ translatedText });
}
