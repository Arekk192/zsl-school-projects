import formidable from "formidable";
import * as fs from "fs";
import path from "path";

const __dirname = path.resolve();

const fileController = {
  savePhoto: async (req) => {
    return new Promise((res, rej) => {
      try {
        const form = formidable({
          uploadDir: "./uploads", // path.join(__dirname, ""),
          keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
          console.log(files);
          //   if (err) res(err.message);
          //   else {
          //     fs.writeFile(path.join(__dirname, "upload", files))
          //   }
        });
      } catch (error) {
        rej(error);
      }
    });
  },
};

export default fileController;

// form.parse(req, (err, data) => {
//   if (err) throw err;

//   fs.writeFile(
//     path.join(__dirname, "static", "themes.config.json"),
//     JSON.stringify(data),
//     (err) => {
//       if (err) throw err;
//     }
//   );
//   res.redirect(`/filemanager?name=${currDirectory}`);
// });
