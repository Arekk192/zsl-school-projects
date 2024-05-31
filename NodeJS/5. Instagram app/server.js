import imageRouter from "./app/imageRouter.js";
import tagsRouter from "./app/tagsRouter.js";
import { createServer } from "http";
const PORT = 3000;

createServer(async (req, res) => {
  if (req.url.search("/api/photos") != -1) {
    await imageRouter(req, res);
  } else if (req.url.search("/api/tags") != -1) {
    await tagsRouter(req, res);
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
