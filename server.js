const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, 'dist');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function securityHeaders() {
  return {
    'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store'
  };
}

http.createServer((request, response) => {
  try {
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    const filePath = path.resolve(root, relativePath);
    const insideRoot = filePath === root || filePath.startsWith(`${root}${path.sep}`);

    if (!insideRoot) {
      response.writeHead(403, { ...securityHeaders(), 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Forbidden');
      return;
    }

    fs.stat(filePath, (statError, stats) => {
      if (statError || !stats.isFile()) {
        response.writeHead(404, { ...securityHeaders(), 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      response.writeHead(200, { ...securityHeaders(), 'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(response);
    });
  } catch {
    response.writeHead(400, { ...securityHeaders(), 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
  }
}).listen(4173, () => console.log('Açaí na Cuia local: http://localhost:4173/'));
