import { createServer } from "http";
import tracer from "tracer";

const console = tracer.colorConsole();
const PORT = 3000;
const server = createServer((req, res) => {
  const url = decodeURI(req.url);

  // logger.log("hello"); // white
  // logger.trace("hello"); // violet
  // logger.debug("hello"); // blue
  // logger.info("hello"); // green
  // logger.warn("hello"); // yellow
  // logger.error("hello"); // red

  if (url == "/biel" || url == "/biały") console.log(url);
  else if (url == "/fioletowy" || url == "/fiolet") console.trace(url);
  else if (url == "/niebieski") console.debug(url);
  else if (url == "/zielony" || url == "/zieleń") console.info(url);
  else if (url == "/żółć" || url == "/żółty") console.warn(url);
  else if (url == "/czerwień" || url == "/czerwony") console.error(url);
  else console.log("nieznany kolor");

  res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
  res.end(`<h1>Patrz konsola serwera</h1>`);
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
