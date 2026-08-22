import { NextResponse } from 'next/server';
import { extname } from 'path';
import { cookies } from 'next/headers';
import { verifyToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/lib/db';
import { mediaUrl, saveUploadedMedia } from '@/lib/media';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico',
  'mp4', 'webm',
  'pdf', 'doc', 'docx',
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string)?.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const ext = extname(file.name).slice(1).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: `File type .${ext} is not allowed` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${uuidv4()}.${ext}`;
    const relativePath = `${category}/${filename}`;
    const url = mediaUrl(category, filename);

    try {
      await saveUploadedMedia(relativePath, buffer);
    } catch (writeErr) {
      console.error('[Upload] File write error:', writeErr);
      return NextResponse.json({ error: 'Failed to persist file' }, { status: 500 });
    }

    try {
      await db.uploadedFile.create({
        data: {
          filename: file.name,
          url,
          mimetype: file.type || 'application/octet-stream',
          size: buffer.length,
          category,
        },
      });
    } catch (dbErr) {
      console.error('[Upload] DB record creation failed (file still saved):', dbErr);
    }

    return NextResponse.json({
      url,
      filename: file.name,
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    return NextResponse.json({ error: String((error as Error)?.message || 'Upload failed') }, { status: 500 });
  }
}
