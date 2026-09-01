// ============================================================================
//  Local dev server that mimics GitHub Pages' 404-fallback behavior: a real
//  file is served as-is, but any other path (in particular /bar-<id>, the
//  Bietschimeile QR-code scan target) gets 404.html's content instead, with
//  the browser still showing the originally requested URL (no redirect) –
//  exactly what GitHub Pages does for a project page.
//
//  Needed because VS Code's "Live Server" (and most simple static servers)
//  don't do this: they return their own generic 404 ("Cannot GET /...")
//  instead of 404.html, so the QR scan flow can't be tested through it.
//
//  Usage:  node scripts/dev-server.js [port]   (default port 5500)
//  No dependencies – plain Node http/fs.
// ============================================================================

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.argv[2]) || 5500;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(ROOT, urlPath === "/" ? "/index.html" : urlPath);

    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isFile()) return sendFile(res, filePath, 200);

      const notFoundPath = path.join(ROOT, "404.html");
      fs.stat(notFoundPath, (err2) => {
        if (err2) {
          res.writeHead(404);
          return res.end("404");
        }
        sendFile(res, notFoundPath, 404);
      });
    });
  })
  .listen(PORT, () =>
    console.log(`Dev server (GitHub-Pages-like 404 fallback) on http://localhost:${PORT}`)
  );

function sendFile(res, filePath, status) {
  const ext = path.extname(filePath);
  res.writeHead(status, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}
