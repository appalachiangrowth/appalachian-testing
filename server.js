const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Explicit MIME type map — no dependency on external mime packages
const MIME_TYPES = new Map([
  ['.js', 'application/javascript'],
  ['.mjs', 'application/javascript'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.avif', 'image/avif'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
  ['.eot', 'application/vnd.ms-fontobject'],
  ['.otf', 'font/otf'],
  ['.html', 'text/html; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml'],
  ['.pdf', 'application/pdf'],
  ['.mp4', 'video/mp4'],
  ['.webm', 'video/webm'],
  ['.mp3', 'audio/mpeg'],
  ['.wav', 'audio/wav'],
  ['.wasm', 'application/wasm'],
  ['.map', 'application/json'],
  ['.data', 'application/octet-stream'],
]);

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES.get(ext) || 'application/octet-stream';
}

// Serve a static file with correct headers
function serveStaticFile(res, filePath, maxAge) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    const mimeType = getMimeType(filePath);
    const cacheControl = maxAge
      ? `public, max-age=${maxAge}, immutable`
      : 'public, max-age=0, must-revalidate';

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': stat.size,
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
    });
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch (e) {
    return false;
  }
}

// Let Next.js auto-discover next.config.ts
const nextApp = require('next')({
  dev: false,
  dir: __dirname,
});

const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const pathname = parsedUrl.pathname;

      // 1. Serve _next/static/* directly from .next/static/
      //    Eliminates dependency on standalone cp step.
      //    Content-hashed files can be cached indefinitely.
      if (pathname.startsWith('/_next/static/')) {
        const relativePath = pathname.slice('/_next/static/'.length);
        const filePath = path.join(__dirname, '.next', 'static', relativePath);
        if (serveStaticFile(res, filePath, 31536000)) {
          return;
        }
      }

      // 2. Serve BUILD_ID
      if (pathname === '/_next/static/BUILD_ID') {
        const filePath = path.join(__dirname, '.next', 'BUILD_ID');
        if (serveStaticFile(res, filePath, 0)) {
          return;
        }
      }

      // 3. Serve public/ files (favicon, robots.txt, images, etc.)
      const knownRoutes = ['/api/', '/admin/', '/blog/', '/_next/'];
      const isKnownRoute = knownRoutes.some((r) => pathname.startsWith(r));
      if (!isKnownRoute && pathname.includes('.') && !pathname.startsWith('/_next/')) {
        const publicPath = path.join(__dirname, 'public', pathname);
        if (serveStaticFile(res, publicPath, 86400)) {
          return;
        }
      }
      if (pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml') {
        const publicExactPath = path.join(__dirname, 'public', pathname);
        if (serveStaticFile(res, publicExactPath, 86400)) {
          return;
        }
      }

      // 4. Everything else -> Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
