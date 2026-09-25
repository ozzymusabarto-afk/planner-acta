const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = '/index.html';
  try {
    const raw = req.url.split('?')[0];
    reqPath = decodeURI(raw);
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/index.html';
    }
  } catch (e) {
    reqPath = '/index.html';
  }

  const filePath = path.normalize(path.join(BASE_DIR, reqPath));

  // Prevenir Directory Traversal (case-insensitive para Windows)
  if (!filePath.toLowerCase().startsWith(BASE_DIR.toLowerCase())) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Proibido');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Arquivo Não Encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

// Sem fixar '0.0.0.0' para permitir dual-stack IPv4 e IPv6 (localhost e 127.0.0.1) no Windows
server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` PLANNER ACTA — Servidor Local Ativo!   `);
  console.log(` Links disponíveis para teste:          `);
  console.log(` 👉 http://localhost:${PORT}/           `);
  console.log(` 👉 http://127.0.0.1:${PORT}/           `);
  console.log(`=========================================`);
});
