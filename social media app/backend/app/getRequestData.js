const getRequestData = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (part) => (body += part.toString()));
      req.on("end", () => resolve(body));
    } catch (error) {
      reject(error);
    }
  });
};
export default getRequestData;
