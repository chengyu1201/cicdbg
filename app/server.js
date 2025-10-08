// app/server.js (替換原檔內容)
import http from "http";
const port = process.env.PORT || 8080;
const version = process.env.APP_VERSION || "dev";
const color = (process.env.APP_COLOR || "unknown").toLowerCase();

const html = (v, c) => `<!doctype html>
<meta charset="utf-8" />
<title>Cloud Run Blue/Green</title>
<style>
  body { font-family: ui-sans-serif, system-ui; margin: 2rem; color: #e5e7eb; background:#111827 }
  .pill { display:inline-block; padding:.35rem .75rem; border-radius:9999px; font-weight:600 }
  .blue  { background:#1e3a8a }
  .green { background:#065f46 }
  pre   { background:#0b1220; padding:1rem; border-radius:.5rem; }
</style>
<h1>Cloud Run Demo</h1>
<p>Current color:
  <span class="pill ${c==='green'?'green':'blue'}">${c}</span>
</p>
<pre>version=${v}
color=${c}</pre>`;

const server = http.createServer((req,res) => {
  if (req.url === "/healthz" || req.url === "/ready") { res.writeHead(200); res.end("ok"); return; }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html(version, color));
});
server.listen(port, () => console.log(`Listening on ${port} (v=${version}, color=${color})`));
