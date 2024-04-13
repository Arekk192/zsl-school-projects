import getRequestData from "./getRequestData.js";
import fileController from "./fileController.js";
import jsonController from "./jsonController.js";

// funkcjonalności do wykonania:

// 1) post image i nazwy albumu
// 2) get jsona wszystkich zdjęć
// 3) get jsona jednego zdjęcia
// 4) patch jsona
// 5) delete image i jsona

// routing:

// POST /api/photos
// GET /api/photos
// GET /api/photos/123456
// DELETE /api/photos/123456
// PATCH  /api/photos

const router = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url === "/api/photos") {
        res.writeHead(200, {
          "Content-type": "application/json;charset=utf-8",
        });
        res.end(JSON.stringify(jsonController.getall()));
      } else if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
        const id = req.url.replace("/api/photos/", "");
        const data = jsonController.get(id);

        res.writeHead(data.status, {
          "Content-type": "application/json;charset=utf-8",
        });
        res.end(JSON.stringify(data));
      }
      break;
    case "POST":
      if (req.url == "/api/photos") {
        fileController.savePhoto();

        // res.writeHead(200, {
        //   "Content-type": "application/json;charset=utf-8",
        // });
        // res.end(JSON.stringify({ file: true }));
      }
  }
};

export default router;
