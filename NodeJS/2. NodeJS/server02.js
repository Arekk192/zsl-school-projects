import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  console.log(`adres żądania: ${req.url}`);
  res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
  res.end(`<h1>adres url żądania to: ${req.url}</h1>`);
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
