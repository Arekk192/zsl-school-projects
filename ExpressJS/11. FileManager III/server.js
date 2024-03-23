const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
const app = express();
const PORT = 3000;

let currDir = path.join(__dirname, "files");
let paths = [{ name: "home", path: "/" }];

const getIcon = (ext) => {
  let icon = "./gfx/plain_icon.svg";
  if (ext == "png") icon = "./gfx/png_icon.svg";
  else if (ext == "jpg") icon = "./gfx/jpg_icon.svg";
  else if (ext == "txt") icon = "./gfx/txt_icon.svg";
  return icon;
};

const getFiles = (filepath) => {
  const _files = fs.readdirSync(filepath),
    root = filepath.replace(path.join(__dirname, "files"), ""),
    files = [],
    dirs = [];

  _files.map((file) => {
    const stats = fs.lstatSync(path.join(filepath, file)),
      isDir = stats.isDirectory();
    if (isDir) {
      const _path = path.join(root, file);
      const dirpath = _path[0] == "/" ? _path : `/${_path}`;
      dirs.push({ name: file, root: root, path: dirpath });
    } else {
      const ext = path.parse(file).ext;
      files.push({ root: root, name: file, icon: getIcon(ext) });
    }
  });

  return { files: files, dirs: dirs, currDir: currDir, paths: paths };
};

const getPath = (file) => {
  let _path = path.join(__dirname, "files");
  file.split("/").forEach((el) => (_path = path.join(_path, el)));
  return _path;
};

app.get("/", (req, res) => res.redirect("/filemanager"));
app.get("/filemanager", (req, res) => {
  const name = req.query.name;

  if (name) {
    let curr = path.join(__dirname, "files");
    paths = [{ name: "home", path: "/" }];

    name.split("/").forEach((f, i) => {
      if (f == "") return;
      curr = path.join(curr, f);
      const updir = paths[paths.length - 1].path;
      paths.push({ name: f, path: i == 0 ? `${updir}${f}` : `${updir}/${f}` });
    });

    currDir = curr;

    res.render("index.hbs", getFiles(curr));
  } else res.render("index.hbs", getFiles(path.join(__dirname, "files")));
});

app.post("/filemanager", (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: currDir,
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

        if (!fs.existsSync(path.join(currDir, f.name)))
          try {
            fs.renameSync(path.join(currDir, base), path.join(currDir, f.name));
          } catch (error) {
            console.error(error);
            res.redirect("filemanager");
          }
        else {
          const date = Date.now();
          try {
            const ext = path.parse(f.path).ext;
            if (ext) {
              fs.renameSync(
                path.join(currDir, base),
                path.join(currDir, `${f.name.replace(ext, "")}_${date}${ext}`)
              );
            } else {
              fs.renameSync(
                path.join(currDir, base),
                path.join(currDir, `${f.name}_${date}`)
              );
            }
          } catch (error) {
            console.error(error);
            res.redirect("filemanager");
          }
        }
      });
    } else {
      const base = path.parse(data.path).base;
      const ext = path.parse(data.path).ext;
      const name = data.name;

      if (!fs.existsSync(path.join(currDir, name)))
        try {
          fs.renameSync(path.join(currDir, base), path.join(currDir, name));
        } catch (error) {
          console.error(error);
          res.redirect("filemanager");
        }
      else
        try {
          fs.renameSync(
            path.join(currDir, base),
            path.join(currDir, `${name.replace(ext, "")}_${Date.now()}${ext}`)
          );
        } catch (error) {
          console.error(error);
          res.redirect("filemanager");
        }
    }
    res.render("index.hbs", { ...getFiles(currDir), message: message });
  });
});

app.get("/new-directory", (req, res) => {
  const dirpath = path.join(__dirname, "files"),
    root = req.query.root,
    dirname = req.query.dirname,
    dir = path.join(dirpath, root, dirname); //`${dirpath}${root}/${dirname}`;

  if (dirname) {
    if (fs.existsSync(dir))
      res.render("index.hbs", {
        ...getFiles(dir.replace(dirname, "")),
        message: "katalog o podanej nazwie istnieje",
      });
    else {
      fs.mkdirSync(dir, (err, files) => {
        if (err) throw err;
      });
      res.render("index.hbs", {
        ...getFiles(dir.replace(dirname, "")),
        message: "katalog utworzony pomyślnie",
      });
    }
  } else
    res.render("index.hbs", {
      ...getFiles(dir.replace(dirname, "")),
      message: "niepoprawna nazwa katalogu",
    });
});

app.get("/delete-directory", (req, res) => {
  const dirpath = path.join(__dirname, "files"),
    root = req.query.root,
    dirname = req.query.dirname,
    directory = path.join(dirpath, root, dirname);

  if (fs.existsSync(directory)) {
    if (fs.readdirSync(directory).length == 0) {
      fs.rmdirSync(directory);
      res.render("index.hbs", {
        ...getFiles(`${dirpath}${root}`),
        message: "katalog usunięty pomyślnie",
      });
    } else
      res.render("index.hbs", {
        ...getFiles(`${dirpath}${root}`),
        message: "katalog nie jest pusty",
      });
  }
});

app.get("/new-text-file", (req, res) => {
  const root = path.join(__dirname, "files"),
    dirname = req.query.root,
    filename = req.query.filename,
    dir = path.join(root, dirname);

  if (filename) {
    fs.writeFile(path.join(dir, `${filename}.txt`), "", (err) => {
      if (err) throw err;
    });
    res.render("index.hbs", { ...getFiles(dir), message: "utworzono plik" });
  } else
    res.render("index.hbs", { ...getFiles(dir), message: "niepoprawna nazwa" });
});

app.get("/delete-file", (req, res) => {
  const dirpath = path.join(__dirname, "files"),
    root = req.query.root,
    filename = req.query.filename,
    dir = path.join(dirpath, root),
    file = path.join(dir, filename),
    message = "plik usunięty pomyślnie";

  if (fs.existsSync(file)) fs.rmSync(file);
  res.render("index.hbs", { ...getFiles(dir), message: message });
});

app.get("/rename-directory", (req, res) => {
  const dirpath = path.join(__dirname, "files"),
    pathname = req.query.path,
    newName = req.query.name,
    arr = pathname.split("/"),
    oldName = arr.pop(),
    root = arr.join("/"),
    oldPath = path.join(dirpath, root, oldName),
    newPath = path.join(dirpath, root, newName);

  paths.pop();

  if (!fs.existsSync(newPath)) {
    fs.rename(oldPath, newPath, (err) => {
      if (err) console.error(err);
    });
    res.render("index.hbs", {
      ...getFiles(path.join(dirpath, root)),
      message: "zmieniono nazwę katalogu",
    });
  } else
    res.render("index.hbs", {
      ...getFiles(path.join(dirpath, root)),
      message: "katalog o podanej nazwie istnieje",
    });
});

app.use(express.static("static"));
app.engine(
  "hbs",
  hbs({
    defaultLayout: "main.hbs",
    extname: ".hbs",
    partialsDir: "views/partials",
    helpers: {
      isLast: (value, length) => length == 1 || value == length - 1,
      isHome: (el) => el.name == "home",
      getPath: (_path) => _path.replace(path.join(__dirname, "files"), ""),
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
