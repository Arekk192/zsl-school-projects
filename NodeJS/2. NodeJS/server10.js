import { readFile } from "fs";
import { createServer } from "http";
import path from "path";

const PORT = 3000;
const server = createServer((req, res) => {
  const url = decodeURI(req.url);
  const __dirname = path.resolve();

  readFile(
    path.join(__dirname, "static", "img", `${url}.jpg`),
    (error, data) => {
      if (error) {
        res.writeHead(404, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg;" });
        res.write(data);
        res.end();
      }
    }
  );
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
