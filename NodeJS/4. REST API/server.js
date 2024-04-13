import { createServer } from "http";
import router from "./app/router.js";
const PORT = 3000;
createServer((req, res) => router(req, res)).listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
);
