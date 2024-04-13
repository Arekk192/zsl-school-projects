import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  const headers = req.headers;
  const userAgent = headers["user-agent"];
  let browser = "";

  if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";

  res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
  res.end(`Twoja przeglądarka to ${browser}`);
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
