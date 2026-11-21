// Twin Peaks — local play server (development only, not part of the entry).
// Serves game/ at http://localhost:8080 so the game can be played and
// screenshotted in a desktop browser. Node 22, standard library only:
//   node serve.ts
// then open http://localhost:8080 in Chrome.

import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'game');
const PORT = Number(process.env.PORT || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
  const file = join(root, path === '/' ? 'index.html' : path);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }
  const stream = createReadStream(file);
  stream.on('error', () => {
    res.writeHead(404);
    res.end('not found');
  });
  stream.on('open', () => {
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    stream.pipe(res);
  });
}).listen(PORT, () => {
  console.log('Twin Peaks at http://localhost:' + PORT);
});
