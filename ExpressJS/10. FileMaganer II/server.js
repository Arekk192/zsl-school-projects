const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
const app = express();
const PORT = 3000;

const getFiles = (filepath) => {
  const _files = fs.readdirSync(filepath),
    files = [],
    dirs = [];

  _files.map((file) => {
    const stats = fs.lstatSync(path.join(filepath, file)),
      isDir = stats.isDirectory();

    if (isDir) dirs.push({ name: file });
    else {
      const ext = path.extname(file);
      let icon = "./gfx/plain_icon.svg";
      if (ext == ".png") icon = "./gfx/png_icon.svg";
      else if (ext == ".jpg") icon = "./gfx/jpg_icon.svg";
      else if (ext == ".txt") icon = "./gfx/txt_icon.svg";
      files.push({ name: file, icon: icon });
    }
  });

  return { files: files, dirs: dirs };
};

app.get("/", (req, res) => {
  const filepath = path.join(__dirname, "files");
  res.render("index.hbs", getFiles(filepath));
});

app.post("/", (req, res) => {
  const root = path.join(__dirname, "files");
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: root,
  });

  form.parse(req, function (err, fields, files) {
    const data = files.data;
    const message = Array.isArray(files.data)
      ? `przesłano ${files.data.length} ${
          [2, 3, 4].includes(files.data.length) ? "pliki" : "plików"
        }`
      : "przesłano 1 plik";

    if (Array.isArray(data)) {
      data.forEach((f) => {
        const base = path.parse(f.path).base;
        const ext = path.parse(f.path).ext;

        if (!fs.existsSync(path.join(root, f.name))) {
          try {
            fs.renameSync(path.join(root, base), path.join(root, f.name));
          } catch (error) {
            return;
          }
        } else {
          const date = Date.now();
          try {
            if (ext) {
              fs.renameSync(
                path.join(root, base),
                path.join(root, `${f.name.replace(ext, "")}_${date}${ext}`)
              );
            } else {
              fs.renameSync(
                path.join(root, base),
                path.join(root, `${f.name}_${date}`)
              );
            }
          } catch (error) {
            return;
          }
        }
      });
    } else {
      const base = path.parse(data.path).base;
      const ext = path.parse(data.path).ext;
      const name = data.name;

      if (!fs.existsSync(path.join(root, name)))
        try {
          fs.renameSync(path.join(root, base), path.join(root, name));
        } catch (error) {
          return;
        }
      else {
        try {
          fs.renameSync(
            path.join(root, base),
            path.join(root, `${name.replace(ext, "")}_${Date.now()}${ext}`)
          );
        } catch (error) {
          return;
        }
      }
    }
    res.render("index.hbs", { ...getFiles(root), message: message });
  });
});

app.get("/new-directory", (req, res) => {
  const dirpath = path.join(__dirname, "files");
  const dir = path.join(dirpath, req.query.dirname);

  if (req.query.dirname) {
    if (fs.existsSync(dir))
      res.render("index.hbs", {
        ...getFiles(dirpath),
        message: "katalog o podanej nazwie istnieje",
      });
    else {
      fs.mkdirSync(dir, (err, files) => {
        if (err) throw err;
      });
      res.render("index.hbs", {
        ...getFiles(dirpath),
        message: "katalog utworzony pomyślnie",
      });
    }
  } else
    res.render("index.hbs", {
      ...getFiles(dirpath),
      message: "niepoprawna nazwa katalogu",
    });
});

app.get("/delete-directory", (req, res) => {
  const dirpath = path.join(__dirname, "files");
  const dir = path.join(dirpath, req.query.dirname);

  if (fs.existsSync(dir)) fs.rmdirSync(dir);
  res.render("index.hbs", {
    ...getFiles(dirpath),
    message: "katalog usunięty pomyślnie",
  });
});

app.get("/new-text-file", (req, res) => {
  const root = path.join(__dirname, "files");
  const filename = req.query.filename;

  if (filename) {
    fs.writeFile(path.join(root, `${filename}.txt`), "", (err) => {
      if (err) throw err;
    });
    res.render("index.hbs", {
      ...getFiles(root),
      message: "plik utworzony pomyślnie",
    });
  } else
    res.render("index.hbs", {
      ...getFiles(root),
      message: "niepoprawna nazwa pliku",
    });
});

app.get("/delete-file", (req, res) => {
  const root = path.join(__dirname, "files");
  const dir = path.join(root, req.query.filename);

  if (fs.existsSync(dir)) fs.rmSync(dir);
  res.render("index.hbs", {
    ...getFiles(root),
    message: "plik usunięty pomyślnie",
  });
});

app.use(express.static("static"));
app.engine("hbs", hbs({ extname: ".hbs", partialsDir: "views/partials" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
