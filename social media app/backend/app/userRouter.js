import getRequestData from "./getRequestData.js";
import userController from "./userController.js";

const applicationJson = "application/json;charset=utf-8";

const userRouter = async (req, res) => {
  if (req.method === "POST" && req.url === "/api/user/register") {
    const data = JSON.parse(await getRequestData(req));
    const response = await userController.register(data);

    if (!response.error) {
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify(response));
    } else {
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify(response));
    }
  } else if (
    req.method === "GET" &&
    req.url.match(
      /\/api\/user\/confirm\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]+)$/
    )
  ) {
    const token = req.url.replace("/api/user/confirm/", "");
    const response = await userController.confirmUser(token);

    if (!response.error) {
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify(response));
    } else {
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify(response));
    }
  } else if (req.method === "POST" && req.url === "/api/user/login") {
    const data = JSON.parse(await getRequestData(req));
    const response = await userController.login(data);

    if (!response.error) {
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify(response));
    } else {
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify(response));
    }
  }
  // else if (req.method === "GET" && req.url === "/api/user") {
  // res.writeHead(200, { "Content-type": applicationJson });
  // res.end(JSON.stringify(userController.getUsers()));
  // }
};

export default userRouter;
