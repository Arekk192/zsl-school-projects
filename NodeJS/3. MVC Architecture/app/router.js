import { readFile } from "fs";
import path from "path";
import controller from "./controller.js";

const __dirname = path.resolve();
const router = async (req, res) => {
  switch (req.method) {
    case "GET":
      readFile(
        path.join(__dirname, "app", "views", "index.html"),
        (err, file) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.write("<h1>błąd 404 - nie ma pliku!<h1>");
            res.end();
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(file);
            res.end();
          }
        }
      );
      break;
    case "POST":
      if (req.url == "/add") {
        let body = "";

        // req.on("data", (data) => (body += data.toString()));
        // req.on("end", (data) => {
        //   controller.add(JSON.parse(body));

        //   res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        //   res.end(JSON.stringify(JSON.parse(body), null, 4));
        // });

        // użyj odpowiedniej funkcji z controllera
        // odpowiedz do klienta

        // let data = await getRequestData(req);
        // console.log(data);
        // controller.add(data);
      } else if (req.url == "/getall") {
        // pobierz dane z tablicy zwierząt i odpowiedz do klienta
      } else if (req.url == "/delete") {
        // usuń dane z tablicy zwierząt i odpowiedz do klienta
      } else if (req.url == "/update") {
        // updatuj dane z tablicy zwierząt i odpowiedz do klienta
      } // pozostałe funkcje
      break;
  }
};

export default router;
