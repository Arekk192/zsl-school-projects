import { readFile } from "fs";
import { createServer } from "http";
import path from "path";

const PORT = 3000;
const server = createServer((req, res) => {
  const __dirname = path.resolve();
  const mypath = path.join(__dirname, "static", "index.html");
  readFile(mypath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/html;charset=utf-8" });
      res.write("<h1>błąd 404 - nie ma pliku!<h1>");
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      res.write(data);
      res.end();
    }
  });
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
