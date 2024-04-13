import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  //   res.writeHead(200, { "content-type": "text/plain;charset=utf-8" });
  res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
  res.end(`<pre> ${JSON.stringify(req.headers, null, 5)}</pre>`);
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

// text/plain
// text/html
// application/json
// text/xml
// video/mp4
// image/jpeg
// image/png
// text/css
// application/javascript
// audio/mpeg
