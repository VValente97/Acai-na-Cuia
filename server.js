const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, 'dist');
const cardapioPath = path.join(root, 'cardapio.json');
const editorPath = path.join(__dirname, 'editor-precos.html');
const productIds = ['acai-popular', 'acai-medio', 'acai-grosso', 'farinha-agua', 'farinha-tapioca', 'farinha-farofa'];
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
    if (requestPath === '/editar-precos' && request.method === 'GET') {
      response.writeHead(200, { ...securityHeaders(), 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(editorPath).pipe(response);
      return;
    }
    if (requestPath === '/api/cardapio' && request.method === 'PUT') {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk;
        if (body.length > 4096) request.destroy();
      });
      request.on('end', () => {
        try {
          const data = JSON.parse(body);
          const whatsapp = data.whatsapp || '';
          if (typeof whatsapp !== 'string' || (whatsapp && !/^55\d{10,11}$/.test(whatsapp))) throw new Error('WhatsApp inválido');
          if (!data.precos || typeof data.precos !== 'object' || Array.isArray(data.precos)) throw new Error('Preços inválidos');
          const precos = {};
          for (const id of productIds) {
            const price = data.precos[id];
            if (price !== null && (!Number.isInteger(price) || price < 0 || price > 1000000)) throw new Error(`Preço inválido: ${id}`);
            precos[id] = price;
          }
          fs.writeFileSync(cardapioPath, JSON.stringify({ whatsapp, precos }, null, 2) + '\n', 'utf8');
          response.writeHead(200, { ...securityHeaders(), 'Content-Type': 'application/json; charset=utf-8' });
          response.end('{"ok":true}');
        } catch (error) {
          response.writeHead(400, { ...securityHeaders(), 'Content-Type': 'application/json; charset=utf-8' });
          response.end(JSON.stringify({ erro: error.message }));
        }
      });
      return;
    }
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
}).listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => {
  console.log(`Açaí na Cuia local: http://localhost:${Number(process.env.PORT) || 4173}/`);
});
