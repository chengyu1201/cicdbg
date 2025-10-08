// app/server.js
// 這個版本會依 APP_COLOR=blue/green 切整個網頁背景；也保留 /healthz 供 Cloud Run 健康檢查

import http from "http";

const port = process.env.PORT || 8080;

// 由 Cloud Build 在部署時透過 --set-env-vars 注入：APP_VERSION=SHORT_SHA、APP_COLOR=blue|green
const version = process.env.APP_VERSION || "dev";
const color = (process.env.APP_COLOR || "unknown").toLowerCase();

// 將顏色轉成主題 class，避免直接在 JS 寫顏色值
const themeClass = color === "green" ? "theme-green" :
                   color === "blue"  ? "theme-blue"  : "theme-default";

// 產出 HTML（背景顏色、膠囊標籤、簡單資訊）
// 用內嵌 CSS，部署時不用另外處理靜態檔
const html = (v, c, theme) => `<!doctype html>
<meta charset="utf-8" />
<title>Cloud Run Blue/Green</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  :root { --fg:#e5e7eb; --panel:#0b1220; }
  body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans TC', 'Noto Sans', Arial; color:var(--fg); }
  .wrap { max-width:1100px; margin:2rem auto; padding:0 1rem; }
  h1 { margin:0 0 1rem; font-size:2rem; }
  .pill { display:inline-block; padding:.35rem .75rem; border-radius:9999px; font-weight:700; }
  /* 主題：整頁背景 */
  .theme-blue  { background:#0b1220; background-image: linear-gradient(180deg,#0b1220 0,#0f172a 100%); }
  .theme-green { background:#0b1220; background-image: linear-gradient(180deg,#0b1220 0,#052e2a 100%); }
  .theme-default { background:#111827; }
  /* 膠囊色塊（和主題一致） */
  .pill.blue  { background:#1e3a8a; }
  .pill.green { background:#065f46; }
  pre { background:var(--panel); padding:1rem; border-radius:.5rem; overflow:auto; }
  a { color:#93c5fd; }
</style>
<body class="${theme}">
  <div class="wrap">
    <h1>Cloud Run Demo</h1>
    <p>Current color: <span class="pill ${c==='green'?'green':'blue'}">${c}</span></p>
    <pre>version=${v}
color=${c}</pre>
    <p style="opacity:.7">Tip: 顏色來自環境變數 <code>APP_COLOR</code>；由 Cloud Build 依藍綠/金絲雀自動設定。</p>
  </div>
</body>`;

const server = http.createServer((req, res) => {
  // 健康檢查端點：0% 流量時用 tag URL 測試也會用到
  if (req.url === "/healthz" || req.url === "/ready") {
    res.writeHead(200, { "Cache-Control": "no-store" });
    res.end("ok");
    return;
  }

  // 預設頁面：回傳依主題著色的 HTML
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  res.end(html(version, color, themeClass));
});

server.listen(port, () => {
  console.log(`Listening on ${port} (version=${version}, color=${color})`);
});
