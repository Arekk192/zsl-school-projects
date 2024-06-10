import filtersController from "./filtersController.js";
import jsonController from "./imageJsonController.js";
import getRequestData from "./getRequestData.js";

const applicationJson = "application/json;charset=utf-8";
const filtersRouter = async (req, res) => {
  if (
    req.method === "GET" &&
    req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)
  ) {
    const id = req.url.replace("/api/filters/metadata/", "");
    const photo = jsonController.getPhoto(id);

    if (photo) {
      const metadata = await filtersController.getMetaData(photo.url);
      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify(metadata));
    } else {
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message: `photo with id ${id} not found` }));
    }
  } else if (req.method === "PATCH" && req.url === "/api/filters") {
    const data = JSON.parse(await getRequestData(req));
    const url = jsonController.getPhoto(data["photo_id"]).url;
    const filter = data["filter"];

    if (url) {
      let message = `filter ${filter} applied to photo with id ${id}`;

      if (filter === "rotate90") filtersController.rotate(url, 90);
      else if (filter === "rotate270") filtersController.rotate(url, 270);
      else if (filter === "grayscale") filtersController.grayscale(url);
      else if (filter === "flip") filtersController.flip(url);
      else if (filter === "flop") filtersController.flop(url);
      else if (filter === "negate") filtersController.negate(url);
      else if (filter === "resize") {
        if (data.size && data.size.width && data.size.height)
          filtersController.resize(url, data.size);
        else message = "missing paramethers for resize filter";
      } else if (filter === "reformat") filtersController.reformat(url, "png");
      else if (filter === "crop") {
        const crop = data.crop;
        if (crop && crop.width && crop.height && crop.top && crop.left)
          filtersController.crop(url, crop);
        else message = "missing paramethers for crop filter";
      } else if (filter === "tint") {
        if (data.tint && data.tint.r && data.tint.g && data.tint.b)
          filtersController.tint(url, data.tint);
        else message = "missing paramethers for tint filter";
      } else message = `undefined filter: ${filter}`;

      res.writeHead(200, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message }));
    } else {
      const message = `photo with id ${data["photo_id"]} not found`;
      res.writeHead(404, { "Content-type": applicationJson });
      res.end(JSON.stringify({ message }));
    }
  }
};

// TODO crop image

// TODO customize crop, tint, etc

// TODO after filtering a photo,
//      change the history

// TODO get photo
//      (and filtered photo)

export default filtersRouter;
