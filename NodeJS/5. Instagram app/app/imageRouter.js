import fileController from "./imageFileController.js";
import jsonController from "./imageJsonController.js";

const applicationJsonHeader = {
  "Content-type": "application/json;charset=utf-8",
};

const imageRouter = async (req, res) => {
  if (req.method === "GET" && req.url === "/api/photos") {
    res.writeHead(200, applicationJsonHeader);
    res.end(JSON.stringify(jsonController.getAllPhotos()));
  } else if (req.method === "GET" && req.url.match(/\/api\/photos\/([0-9]+)/)) {
    const id = req.url.replace("/api/photos/", "");
    const photo = jsonController.getPhoto(id);

    res.writeHead(photo.status, applicationJsonHeader);
    res.end(JSON.stringify(photo));
  } else if (req.method === "POST" && req.url === "/api/photos") {
    const fileResponse = await fileController.saveFile(req);

    if (!fileResponse.error) {
      jsonController.uploadPhoto(fileResponse);
      res.writeHead(200, applicationJsonHeader);
      res.end(JSON.stringify(fileResponse));
    } else {
      const message = `Error while uploading file. Error:\n${fileResponse.error}`;
      res.writeHead(404, applicationJsonHeader);
      res.end(JSON.stringify({ message: message }));
    }
  } else if (
    req.method === "DELETE" &&
    req.url.match(/\/api\/photos\/([0-9]+)/)
  ) {
    const id = req.url.replace("/api/photos/", "");
    const jsonResponse = jsonController.getPhoto(id);
    // ^ here from get I got data.status (200 or 404)

    if (jsonResponse.status === 200) {
      const file = jsonResponse;
      const fileResponse = await fileController.deleteFile(file);

      if (fileResponse.error) {
        res.writeHead(404, applicationJsonHeader);
        res.end(JSON.stringify({ error: fileResponse.error }));
      } else {
        jsonController.deletePhoto(id);
        res.writeHead(200, applicationJsonHeader);
        res.end(JSON.stringify(fileResponse));
      }
    } else if (jsonResponse.status === 404) {
      res.writeHead(404, applicationJsonHeader);
      res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
    }

    // TODO data.status variable should be here, not in
    // fileController.js

    // TODO rewrite all of that json modifications from fileCtrl

    // if (fileResponse.message) {
    //   jsonController.delete(fileResponse);
  }
  // else if (
  //   req.method === "PATCH" &&
  //   req.url.match(/\/api\/photos\/([0-9]+)/)
  // ) {}
};

export default imageRouter;

// ---- TODO list ----

// -> ZMIANA STRUKTURY SERWERA
//
// |__ app
// |   |__ tagsController.js   // modyfikacje jsona opisującego stan tagów
// |   |__ tagsRouter.js   // router tylko do api tagów
// |   |__ imageRouter.js   // router tylko do api imagów (router z poprzedniej części aplikacji)
//
//
// -> TAGS API
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
