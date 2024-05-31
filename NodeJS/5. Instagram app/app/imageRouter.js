import fileController from "./imageFileController.js";
import jsonController from "./imageJsonController.js";
import getRequestData from "./getRequestData.js";

// PATCH /api/photos/tags
// - aktualizacja danych zdjęcia o nowy tag
//
// PATCH /api/photos/tags/mass
// - aktualizacja danych zdjęcia o tablicę nowych tag-ów
//
// GET /api/photos/tags/12345
// - pobranie tagów danego zdjęcia

const applicationJson = "application/json;charset=utf-8";
const imageRouter = async (req, res) => {
  if (req.method === "GET" && req.url === "/api/photos") {
    res.writeHead(200, { "Content-type": applicationJson });
    res.end(JSON.stringify(jsonController.getAllPhotos()));
  } else if (req.method === "GET" && req.url.match(/\/api\/photos\/([0-9]+)/)) {
    const id = req.url.replace("/api/photos/", "");
    const photo = jsonController.getPhoto(id);
    if (photo) {
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify(photo));
    } else {
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
    }
  } else if (req.method === "POST" && req.url === "/api/photos") {
    const fileResponse = await fileController.saveFile(req);
    if (!fileResponse.error) {
      jsonController.uploadPhoto(fileResponse);
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify(fileResponse));
    } else {
      const message = `Error while uploading file. Error:\n${fileResponse.error}`;
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message }));
    }
  } else if (
    req.method === "DELETE" &&
    req.url.match(/\/api\/photos\/([0-9]+)/)
  ) {
    const id = req.url.replace("/api/photos/", "");
    const jsonResponse = jsonController.getPhoto(id);

    if (jsonResponse) {
      const file = jsonResponse;
      const fileResponse = await fileController.deleteFile(file);

      if (fileResponse.error) {
        res.writeHead(404, { "Content-type": applicationJson });
        res.end(JSON.stringify({ error: fileResponse.error }));
      } else {
        jsonController.deletePhoto(id);
        res.writeHead(202, { "Content-type": applicationJson });
        res.end(JSON.stringify(fileResponse));
      }
    } else {
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
    }
  } else if (req.method === "PATCH" && req.url === "/api/photos/tags") {
    const requestData = JSON.parse(await getRequestData(req));
    const photo = jsonController.getPhoto(requestData["photo_id"]);

    if (photo) {
      jsonController.addTagsToPhoto(photo, requestData.tags);
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message: "xd" }));
    } else {
      res.writeHead(404, { "Content-type": applicationJson });

      // TODO message
      res.end(JSON.stringify({ message: "cannot find photo" }));
    }
  }
  // else if (
  //   req.method === "PATCH" &&
  //   req.url.match(/\/api\/photos\/([0-9]+)/)
  // ) {}
};

export default imageRouter;

// ---- TODO list ----
//
// -> PATCH PHOTO
// Po zrobieniu tags API patch do edycji danych
// (tagi zdjecia)
//
//
// -> filtry dla zdjec sharp
//
// USERS API
// ...
