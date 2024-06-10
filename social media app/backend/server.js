import filtersRouter from "./app/filtersRouter.js";
import imageRouter from "./app/imageRouter.js";
import tagsRouter from "./app/tagsRouter.js";
import { createServer } from "http";
const PORT = 3000;

createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PATCH, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
  } else if (req.url.search("/api/photos") != -1) {
    await imageRouter(req, res);
  } else if (req.url.search("/api/tags") != -1) {
    await tagsRouter(req, res);
  } else if (req.url.search("/api/filters") != -1) {
    await filtersRouter(req, res);
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
