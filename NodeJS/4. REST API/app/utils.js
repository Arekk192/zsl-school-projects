const getRequestData = async (req) => {
  return new Promise((res, rej) => {
    try {
      let body = "";
      req.on("data", (part) => (body += part.toString()));
      req.on("end", () => res(body));
    } catch (error) {
      rej(error);
    }
  });
};
export default getRequestData;
