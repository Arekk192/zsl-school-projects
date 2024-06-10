import sharp from "sharp";
import path from "path";

// TODO tests

const rename = (url, action) => {
  const data = path.parse(url);
  const file = path.join(data.dir, data.name);
  const ext = data.ext;
  return `${file}-${action}${ext}`;
};

const filtersController = {
  getMetaData: async (url) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (url) resolve(await sharp(url).metadata());
        else resolve({ error: `file ${url} not found` });
      } catch (error) {
        reject({ error: error.message });
      }
    });
  },
  crop(url, crop) {
    return new Promise(async (resolve, reject) => {
      resolve(await sharp(url).extract(crop).toFile(rename(url, "cropped")));
      try {
      } catch (error) {
        reject({ error });
      }
    });
  },
  rotate(url, angle) {
    return new Promise(async (resolve, reject) => {
      resolve(await sharp(url).rotate(angle).toFile(rename(url, "rotated")));
      try {
      } catch (error) {
        reject({ error });
      }
    });
  },
  reformat(url, format) {
    return new Promise(async (resolve, reject) => {
      const data = path.parse(url);
      const file = path.join(data.dir, data.name);
      const filename = `${file}-reformatted.${format}`;
      resolve(await sharp(url).toFormat(format).toFile(filename));
      try {
      } catch (error) {
        reject({ error });
      }
    });
  },
  resize(url, size) {
    return new Promise(async (resolve, reject) => {
      resolve(await sharp(url).resize(size).toFile(rename(url, "rotated")));
      try {
      } catch (error) {
        reject({ error });
      }
    });
  },
  grayscale(url) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await sharp(url).grayscale().toFile(rename(url, "grayscale")));
      } catch (error) {
        reject({ error });
      }
    });
  },
  flip(url) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await sharp(url).flip().toFile(rename(url, "flipped")));
      } catch (error) {
        reject({ error });
      }
    });
  },
  flop(url) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await sharp(url).flop().toFile(rename(url, "flopped")));
      } catch (error) {
        reject({ error });
      }
    });
  },
  negate(url) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await sharp(url).negate().toFile(rename(url, "negate")));
      } catch (error) {
        reject({ error });
      }
    });
  },
  tint(url, tint) {
    return new Promise(async (resolve, reject) => {
      try {
        await sharp(url).tint(tint).toFile(rename(url, "tint"));
      } catch (error) {
        reject({ error });
      }
    });
  },
};

export default filtersController;
