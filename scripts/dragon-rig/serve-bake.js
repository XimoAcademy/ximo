// Bake host for the dragon skeleton. Serves scripts/dragon-rig/ (plus the GLB
// out of public/models/) and exposes a POST /save sink so bake.html can write
// dragon-rig.bin straight into public/models/.
//
//   node scripts/dragon-rig/serve-bake.js
//   → open http://localhost:4322/bake.html
//
// See docs/dragon-rig.md.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MODELS = path.resolve(__dirname, '../../public/models');
const ALLOWED_OUT = MODELS;

const types = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'application/octet-stream', '.bin': 'application/octet-stream' };

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url.startsWith('/save')) {
    const name = new URL(req.url, 'http://x').searchParams.get('name') || '';
    if (!/^[\w.-]+$/.test(name)) { res.writeHead(400); return res.end('bad name'); }
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      let buf = Buffer.concat(chunks);
      let dir = ALLOWED_OUT;
      if (name.endsWith('.png')) {
        // data-URL text body → binary PNG, kept in the scratchpad (not the repo)
        const s = buf.toString('utf8');
        buf = Buffer.from(s.slice(s.indexOf(',') + 1), 'base64');
        dir = path.join(ROOT, 'shots');
        fs.mkdirSync(dir, { recursive: true });
      }
      const out = path.join(dir, name);
      fs.writeFileSync(out, buf);
      console.log('WROTE', out, buf.length, 'bytes');
      res.writeHead(200, { 'access-control-allow-origin': '*' });
      res.end(JSON.stringify({ ok: true, bytes: buf.length, path: out }));
    });
    return;
  }
  // serve scripts/dragon-rig/, falling back to public/models/ for the GLB
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'bake.html';
  let p = path.join(ROOT, rel);
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) {
    const alt = path.join(MODELS, rel);
    if (alt.startsWith(MODELS) && fs.existsSync(alt)) p = alt;
    else { res.writeHead(404); return res.end('not found: ' + rel); }
  }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(4322, () => console.log('dragon rig bake host → http://localhost:4322/bake.html'));
