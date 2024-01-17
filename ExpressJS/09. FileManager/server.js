const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const formidable = require("formidable");
const app = express();
const PORT = 3000;

let filesArray = [];

app.get("/", (req, res) => {
  res.render("upload.hbs");
});

app.post("/", (req, res) => {
  const form = formidable({ multiples: true, keepExtensions: true });

  form.uploadDir = `${__dirname}/static/upload/`;
  form.parse(req, function (err, fields, files) {
    let message = "";
    if (Array.isArray(files.data)) {
      const filesArrayLength = filesArray.length;
      files.data.forEach((file, i) => {
        filesArray.push({
          id: filesArrayLength + i + 1,
          name: file.name,
          path: file.path,
          size: file.size,
          type: file.type,
          savedate: new Date().getTime(),
        });
      });
      message = `przesłano ${files.data.length} ${
        [2, 3, 4].includes(files.data.length) ? "pliki" : "plików"
      }`;
    } else {
      filesArray.push({
        id: filesArray.length + 1,
        name: files.data.name,
        path: files.data.path,
        size: files.data.size,
        type: files.data.type,
        savedate: new Date().getTime(),
      });
      message = `przesłano 1 plik`;
    }
    res.render("upload.hbs", { message: message });
  });
});

app.get("/filemanager", (req, res) => {
  res.render("filemanager.hbs", { files: filesArray });
});

app.get("/show", (req, res) => {
  const id = req.query.id;
  if (filesArray[id - 1]) res.sendFile(filesArray[id - 1].path);
  else res.send("brak podanego pliku");
});

app.get("/info", (req, res) => {
  const id = req.query.id;
  res.render("info.hbs", { file: filesArray[id - 1] });
});

app.get("/download", (req, res) => {
  const id = req.query.id;
  const file = filesArray[id - 1];
  if (file) res.download(file.path);
});

app.get("/delete", (req, res) => {
  const id = req.query.id;
  const arr = [];

  filesArray.forEach((el) => {
    if (el.id != id) arr.push(el);
  });
  filesArray = arr;
  res.render("filemanager.hbs", { files: filesArray });
});

app.get("/deleteall", (req, res) => {
  filesArray = [];
  res.render("filemanager.hbs", { files: [] });
});

app.get("reset", (req, res) => {
  filesArray = [];
  res.render("filemanager.hbs", { files: filesArray });
});

app.use(express.static("static"));
app.engine(
  "hbs",
  hbs({
    extname: ".hbs",
    partialsDir: "views/partials",
    helpers: {
      getIcon: (fileType) => {
        switch (fileType) {
          case "image/png":
            return "./gfx/png_icon.svg";
          case "image/jpg":
            return "./gfx/jpg_icon.svg";
          case "text/plain":
            return "./gfx/txt_icon.svg";
          default:
            return "./gfx/plain_icon.svg";
        }
      },
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
