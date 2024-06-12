import getRequestData from "./getRequestData.js";
import userController from "./userController.js";

const applicationJson = "application/json;charset=utf-8";

const userRouter = async (req, res) => {
  if (req.method === "POST" && req.url === "/api/user/register") {
    const data = JSON.parse(await getRequestData(req));
    console.log(data);
    const token = userController.register(data);
    res.writeHead(200, { "Content-type": applicationJson });
    res.end(JSON.stringify({ token }));
  } else if (
    req.method === "GET" &&
    req.url.match(
      /\/api\/user\/confirm\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]+)$/
    )
  ) {
    const token = req.url.replace("/api/user/confirm/", "");
    const decoded = userController.verifyToken(token);

    res.writeHead(200, { "Content-type": applicationJson });
    res.end(JSON.stringify({ decoded }));
  } else if (req.method === "POST" && req.url === "/api/user/login") {
    // logowanie z odesłaniem tokena po zalogowaniu
    // - od tej pory każde żądanie zasobów ma zawierać token
  } else if (req.method === "GET" && req.url === "/api/user") {
    // get json all users - funkcja pomocnicza dla testów zarejestrowanych userów
  }
};

export default userRouter;
