export default getRequestData = async (req) => {
  return new Promise((res, rej) => {
    try {
      let body = "";

      req.on("data", (part) => {
        body += part.toString();
      });

      req.on("end", () => {
        // mamy dane i zwracamy z promisy
        res(body);
      });
    } catch (error) {
      rej(error);
    }
  });
};
