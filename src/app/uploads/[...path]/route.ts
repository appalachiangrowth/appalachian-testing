import { NextResponse } from 'next/server';
import { mediaContentType, readUploadedMedia } from '@/lib/media';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const relativePath = path.join('/');

  try {
    const file = await readUploadedMedia(relativePath);
    if (!file) return new NextResponse('Not Found', { status: 404 });

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': mediaContentType(relativePath),
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}
