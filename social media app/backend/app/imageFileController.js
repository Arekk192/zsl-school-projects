import formidable from "formidable";
import * as fs from "fs";
import path from "path";

const __dirname = path.resolve();

const fileController = {
  saveFile: async (req) => {
    return new Promise((resolve, reject) => {
      try {
        const uploadDir = path.join(__dirname, "uploads");
        formidable({
          uploadDir: uploadDir,
          keepExtensions: true,
        }).parse(req, async (err, fields, files) => {
          if (err) resolve({ error: err.message });
          else {
            const file = files.file;
            const albumName = fields.album;
            const albumPath = path.join(uploadDir, albumName);
            const data = path.parse(file.path);
            const newName = path.join(data.dir, albumName, data.base);

            if (!fs.existsSync(albumPath)) {
              fs.mkdir(albumPath, (error) => {
                if (error) resolve({ error });
                else {
                  fs.rename(file.path, newName, (error) => {
                    if (error) resolve({ error });
                    else {
                      const date = Date.now();
                      resolve({
                        id: date,
                        album: albumName,
                        originalName: file.name,
                        url: newName,
                        lastChange: "original",
                        tags: [],
                        history: [{ filter: "original", timestamp: date }],
                      });
                    }
                  });
                }
              });
            } else {
              fs.rename(file.path, newName, (error) => {
                if (error) resolve({ error });
                else {
                  const date = Date.now();
                  resolve({
                    id: date,
                    album: albumName,
                    originalName: file.name,
                    url: newName,
                    lastChange: "original",
                    tags: [],
                    history: [{ filter: "original", timestamp: date }],
                  });
                }
              });
            }
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  deleteFile: async (file) => {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(file.url))
          resolve({ error: `file ${file.url} not found` });
        else
          fs.rm(file.url, (error) => {
            if (error) resolve({ error });
            else {
              const message = `file with id ${file.id} deleted successfully`;
              resolve({ message });
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  },
  readPhoto: async (filePath) => {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(filePath, (error, data) => {
          if (error) resolve({ error });
          else resolve({ data });
        });
      } catch (error) {
        reject({ error });
      }
    });
  },
};

export default fileController;
