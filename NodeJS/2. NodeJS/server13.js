import { readFile } from "fs";
import { createServer } from "http";
import path from "path";

const PORT = 3000;
const server = createServer((req, res) => {
  const url = decodeURI(req.url);
  const __dirname = path.resolve();
  const ext = path.parse(url).ext;
  const base = path.parse(url).base;

  let contentType = "text/plain;charset=utf-8";
  if (ext == ".html") contentType = "text/html;charset=utf-8";
  else if (ext == ".json") contentType = "application/json";
  else if (ext == ".xml") contentType = "text/xml";
  else if (ext == ".mp4") contentType = "video/mp4";
  else if (ext == ".jpeg") contentType = "image/jpeg";
  else if (ext == ".jpg") contentType = "image/jpeg";
  else if (ext == ".png") contentType = "image/png";
  else if (ext == ".css") contentType = "text/css";
  else if (ext == ".js") contentType = "application/javascript";
  else if (ext == ".mp3") contentType = "audio/mpeg";

  readFile(path.join(__dirname, "static", base), (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/html;charset=utf-8" });
      res.write("<h1>błąd 404 - nie ma pliku!<h1>");
      res.end();
    } else {
      console.log("else");
      console.log({ "Content-Type": contentType });
      res.writeHead(200, { "Content-Type": contentType });
      res.write(data);
      res.end();
    }
  });
});

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
