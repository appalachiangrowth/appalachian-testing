import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { extname, join, resolve, sep } from 'path';

/**
 * Runtime media storage. Set UPLOAD_DIR to a persistent directory on the
 * production host (outside the release/build directory) for deploy-safe files.
 */
export function getUploadRoot(): string {
  return process.env.UPLOAD_DIR?.trim() || join(process.cwd(), 'data', 'uploads');
}

const LEGACY_UPLOAD_ROOTS = () => [
  ...(process.env.LEGACY_UPLOAD_DIR?.trim() ? [process.env.LEGACY_UPLOAD_DIR.trim()] : []),
  join(process.cwd(), 'public', 'uploads'),
  join(process.cwd(), '.next', 'standalone', 'public', 'uploads'),
];

function safePath(root: string, relativePath: string): string {
  const normalized = relativePath.replace(/^[/\\]+/, '').replaceAll('\\', '/');
  if (!normalized || normalized.includes('\0')) throw new Error('Invalid media path');

  const rootPath = resolve(root);
  const filePath = resolve(rootPath, normalized);
  if (filePath !== rootPath && !filePath.startsWith(`${rootPath}${sep}`)) {
    throw new Error('Invalid media path');
  }
  return filePath;
}

export function normalizeMediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const url = String(value).trim();
  if (!url) return null;
  if (/^(https?:|data:|blob:|#)/i.test(url)) return url;
  if (url.startsWith('/api/media/')) return url;
  if (url.startsWith('/uploads/')) return `/api/media/${url.slice('/uploads/'.length)}`;
  if (url.startsWith('uploads/')) return `/api/media/${url.slice('uploads/'.length)}`;
  return url;
}

export function mediaPathFromUrl(value: string): string | null {
  const url = normalizeMediaUrl(value);
  if (!url) return null;
  if (url.startsWith('/api/media/')) return url.slice('/api/media/'.length);
  if (url.startsWith('/uploads/')) return url.slice('/uploads/'.length);
  return null;
}

export function mediaUrl(category: string, filename: string): string {
  return `/api/media/${category}/${filename}`;
}

export async function saveUploadedMedia(relativePath: string, data: Buffer): Promise<void> {
  const root = getUploadRoot();
  const filePath = safePath(root, relativePath);
  await mkdir(join(filePath, '..'), { recursive: true });
  await writeFile(filePath, data);
}

export async function readUploadedMedia(relativePath: string): Promise<Buffer | null> {
  const roots = [getUploadRoot(), ...LEGACY_UPLOAD_ROOTS()];
  for (const root of roots) {
    try {
      const filePath = safePath(root, relativePath);
      const info = await stat(filePath);
      if (!info.isFile()) continue;
      return await readFile(filePath);
    } catch {
      // Try the next storage location so legacy uploads remain readable.
    }
  }
  return null;
}

export function mediaContentType(relativePath: string): string {
  const ext = extname(relativePath).toLowerCase();
  const types: Record<string, string> = {
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
  };
  return types[ext] || 'application/octet-stream';
}
