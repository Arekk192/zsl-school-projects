import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  console.log("request");
  res.end("response");
});

server.listen(3000, () => {
  console.log(`http://localhost:${PORT}`);
});
