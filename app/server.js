// path: app/server.js
import http from "http";

const port = process.env.PORT || 8080;
const version = process.env.APP_VERSION || "dev";
const color = process.env.APP_COLOR || "blue-or-green";

const server = http.createServer((req, res) => {
  if (req.url === "/healthz" || req.url === "/ready") {
    res.writeHead(200); res.end("ok");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello Cloud Run!\nversion=${version}\ncolor=${color}\n`);
});

server.listen(port, () => {
  console.log(`Listening on ${port} (version=${version}, color=${color})`);
});
