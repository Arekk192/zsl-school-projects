import { createServer } from "http";
import { readFile } from "fs";
import path from "path";
const PORT = 3000;
const users = [];
createServer((req, res) => {
  switch (req.method) {
    case "GET":
      readFile(path.join(path.resolve(), "index.html"), (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.write("<h1>błąd 404 - nie ma pliku!<h1>");
          res.end();
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
      break;
    case "POST":
      let body = "";

      req.on("data", (data) => (body += data.toString()));
      req.on("end", (data) => {
        const bdata = JSON.parse(body);
        users.push({
          firstName: bdata.firstName,
          lastName: bdata.lastName,
          message: "logowanie usera...",
          time: Date.now(),
        });
        res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        res.end(JSON.stringify(users, null, 4));
      });
      break;
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
