import photoFileController from "./photoFileController.js";
import photoJsonController from "./photoJsonController.js";

const applicationJsonHeader = {
  "Content-type": "application/json;charset=utf-8",
};

const router = async (req, res) => {
  if (req.method === "GET" && req.url === "/api/photos") {
    res.writeHead(200, applicationJsonHeader);
    res.end(JSON.stringify(photoJsonController.getAllPhotos()));
  } else if (req.method === "GET" && req.url.match(/\/api\/photos\/([0-9]+)/)) {
    const id = req.url.replace("/api/photos/", "");
    const photo = photoJsonController.getPhoto(id);

    res.writeHead(photo.status, applicationJsonHeader);
    res.end(JSON.stringify(photo));
  } else if (req.method === "POST" && req.url === "/api/photos") {
    const fileResponse = await photoFileController.saveFile(req);

    if (!fileResponse.error) {
      photoJsonController.uploadPhoto(fileResponse);
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
    const jsonResponse = photoJsonController.getPhoto(id);
    // ^ here from get I got data.status (200 or 404)

    if (jsonResponse.status === 200) {
      const file = jsonResponse;
      const fileResponse = await photoFileController.deleteFile(file);

      if (fileResponse.error) {
        res.writeHead(404, applicationJsonHeader);
        res.end(JSON.stringify({ message: fileResponse.error }));
      } else {
        photoJsonController.deletePhoto(id);
        res.writeHead(200, applicationJsonHeader);
        res.end(JSON.stringify(fileResponse));
      }
    } else if (jsonResponse.status === 404) {
      res.writeHead(404, applicationJsonHeader);
      res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
    }

    // TODO data.status variable should be here, not in
    // photoFileController.js

    // TODO rewrite all of that json modifications from fileCtrl

    // if (fileResponse.message) {
    //   photoJsonController.delete(fileResponse);
  }
  // else if (
  //   req.method === "PATCH" &&
  //   req.url.match(/\/api\/photos\/([0-9]+)/)
  // ) {}
};

export default router;
