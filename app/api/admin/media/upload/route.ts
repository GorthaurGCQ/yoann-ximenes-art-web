import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/guards';

export const runtime = 'nodejs';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function sanitizeBaseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: Request) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
  }

  const extension = extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json({ error: 'Format non supporte' }, { status: 400 });
  }

  const uploadDir = join(process.cwd(), 'public', 'Images', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const originalBase = sanitizeBaseName(file.name.replace(extension, '')) || 'image';
  const filename = `${originalBase}-${randomUUID().slice(0, 8)}${extension}`;
  const absolutePath = join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  const publicPath = `/Images/uploads/${filename}`;
  return NextResponse.json({ ok: true, path: publicPath });
}
