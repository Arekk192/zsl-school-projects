import path from "path";
import controller from "./controller.js";
import getRequestData from "./utils.js";

const __dirname = path.resolve();
const router = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url === "/api/tasks") {
        res.writeHead(200, {
          "Content-type": "application/json;charset=utf-8",
        });
        res.end(JSON.stringify(controller.getall()));
      } else if (req.url.match(/\/api\/tasks\/([0-9]+)/)) {
        const id = req.url.replace("/api/tasks/", "");
        const data = controller.get(id);
        if (data.status === 200) {
          res.writeHead(data.status, {
            "Content-type": "application/json;charset=utf-8",
          });
          res.end(JSON.stringify(data));
        } else {
          res.writeHead(data.status, {
            "Content-type": "application/json;charset=utf-8",
          });
          res.end(JSON.stringify(data));
        }
      }
      break;
    case "POST":
      if (req.url == "/api/tasks") {
        const data = await getRequestData(req);
        controller.insert(data);
        // res.end(JSON.stringify(data));
      } else if (req.url == "/getall") {
        // pobierz dane z tablicy zwierząt i odpowiedz do klienta
      } else if (req.url == "/delete") {
        // usuń dane z tablicy zwierząt i odpowiedz do klienta
      } else if (req.url == "/update") {
        // updatuj dane z tablicy zwierząt i odpowiedz do klienta
      } // pozostałe funkcje
      break;
    case "DELETE":
      if (req.url.match(/\/api\/tasks\/([0-9]+)/)) {
      }
  }
};

export default router;
