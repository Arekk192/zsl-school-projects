import getRequestData from "./getRequestData.js";
import tagsController from "./tagsController.js";

const applicationJson = "application/json;charset=utf-8";
const tagsRouter = async (req, res) => {
  if (req.method === "GET" && req.url === "/api/tags/raw") {
    res.writeHead(200, { "Content-type": applicationJson });
    res.end(JSON.stringify(tagsController.getAllRawTags()));
  } else if (req.method === "GET" && req.url === "/api/tags") {
    res.writeHead(200, { "Content-type": applicationJson });
    res.end(JSON.stringify(tagsController.getAllTags()));
  } else if (req.method === "GET" && req.url.match(/\/api\/tags\/([0-9]+)/)) {
    const id = req.url.replace("/api/tags/", "");
    const tag = tagsController.getTag(id);
    if (tag) {
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify(tag));
    } else {
      res.writeHead(400, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
    }
  } else if (req.method === "POST" && req.url === "/api/tags") {
    const requestData = JSON.parse(await getRequestData(req));
    const tag = requestData.tag;

    if (!tagsController.getAllRawTags().includes(tag)) {
      tagsController.createNewTag({ tag, popularity: 0 });
      res.writeHead(201, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message: `added new tag #${tag}` }));
    } else {
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message: `tag #${tag} exist` }));
    }
  }
};

export default tagsRouter;
