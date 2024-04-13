import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  console.log("request headers:");
  console.log(JSON.stringify(req.rawHeaders, null, 3));
  console.log(JSON.stringify(req.headers, null, 3));
  res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
  res.end(JSON.stringify(req.headers, null, 3));
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
