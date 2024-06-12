import fileController from "./imageFileController.js";
import jsonController from "./imageJsonController.js";
import getRequestData from "./getRequestData.js";
import tagsController from "./tagsController.js";

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
    const data = JSON.parse(await getRequestData(req));
    const id = data["photo_id"];
    const tag = data["tag"];
    const photo = jsonController.getPhoto(id);

    if (photo) {
      if (!tagsController.getAllRawTags().includes(tag))
        tagsController.createNewTag({ tag, popularity: 0 });

      if (!jsonController.getPhotoTags(photo).includes(tag))
        jsonController.addTagToPhoto(photo.id, tag);

      const message = `tag ${tag} added to photo ${photo.id}`;
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message }));
    } else {
      const message = `photo with id ${data["photo_id"]} not found`;
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message }));
    }
  } else if (req.method === "PATCH" && req.url === "/api/photos/tags/mass") {
    const data = JSON.parse(await getRequestData(req));
    const photo = jsonController.getPhoto(data["photo_id"]);

    if (photo) {
      const tags = data["tags"];
      const allTags = tagsController.getAllTags();

      tags.forEach((tag) => {
        if (!allTags.includes(tag))
          tagsController.createNewTag({ tag, popularity: 0 });

        if (!photo.tags.includes(tag))
          jsonController.addTagToPhoto(photo.id, tag);
      });

      const message = `tags ${tags.join(", ")} added to photo ${photo.id}`;
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message }));
    } else {
      const message = `photo with id ${data["photo_id"]} not found`;
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message }));
    }
  } else if (
    req.method === "GET" &&
    req.url.match(/\/api\/photos\/tags\/([0-9]+)/)
  ) {
    const id = req.url.replace("/api/photos/tags/", "");
    const photo = jsonController.getPhoto(id);

    if (photo) {
      const tags = jsonController.getPhotoTags(photo);
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify({ id, tags }));
    } else {
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
    }
  }
};

export default imageRouter;
