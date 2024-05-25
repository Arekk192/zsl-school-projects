import formidable from "formidable";
import * as fs from "fs";
import path, { resolve } from "path";

const __dirname = path.resolve();

const fileController = {
  saveFile: async (req) => {
    return new Promise((resolve, reject) => {
      try {
        const uploadDir = path.join(__dirname, "uploads");
        const form = formidable({
          uploadDir: uploadDir,
          keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
          if (err) resolve({ error: err.message });
          else {
            const file = files.file;
            const albumName = fields.album;
            const albumPath = path.join(uploadDir, albumName);

            const root = path.parse(file.path).dir;
            const base = path.parse(file.path).base;
            const newName = path.join(root, albumName, base);

            if (!fs.existsSync(albumPath)) {
              fs.mkdir(albumPath, (mkdirError) => {
                if (mkdirError) resolve({ error: mkdirError });
                else {
                  fs.rename(file.path, newName, (renameError) => {
                    if (renameError) resolve({ error: renameError });
                    else {
                      const date = Date.now();
                      resolve({
                        id: date,
                        album: albumName,
                        originalName: file.name,
                        url: newName,
                        lastChange: "original",
                        history: [{ status: "original", timestamp: date }],
                      });
                    }
                  });
                }
              });
            } else {
              fs.rename(file.path, newName, (renameError) => {
                if (renameError) resolve({ error: renameError });
                else {
                  const date = Date.now();
                  resolve({
                    id: date,
                    album: albumName,
                    originalName: file.name,
                    url: newName,
                    lastChange: "original",
                    history: [{ status: "original", timestamp: date }],
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
        if (!fs.existsSync(file.url)) {
          // console.log(file);
          // console.log("75 line filectrl.js", {
          //   status: file.status,
          //   message: file.message,
          // });
          // // TODO here
          resolve({ error: `file ${file.url} not found` });
        } else {
          fs.rm(file.url, (err) => {
            if (err) resolve({ error: err });
            else {
              const message = `file with id ${file.id} deleted successfully`;
              resolve({ status: 201, message: message });
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default fileController;
