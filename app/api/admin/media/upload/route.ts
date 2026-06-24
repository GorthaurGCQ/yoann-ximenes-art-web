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

  const originalBase = sanitizeBaseName(file.name.replace(extension, '')) || 'image';
  const filename = `${originalBase}-${randomUUID().slice(0, 8)}${extension}`;

  // Vercel Blob en production, filesystem local en développement
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return NextResponse.json({ ok: true, path: blob.url });
  }

  const uploadDir = join(process.cwd(), 'public', 'Images', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadDir, filename), buffer);

  return NextResponse.json({ ok: true, path: `/Images/uploads/${filename}` });
}
