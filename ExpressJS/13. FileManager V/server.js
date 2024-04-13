const express = require("express");
const hbs = require("express-handlebars");
const cookieparser = require("cookie-parser");
const nocache = require("nocache");
const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(nocache());
app.use(cookieparser());

let currDirectory = "/";
let message = "";
const users = [];

const getFiles = (filepath) => {
  currDirectory = filepath;

  const paths = [{ name: "home", path: "/" }];
  const dirs = [];
  const files = [];

  let dir = path.join(__dirname, "files");

  if (filepath != "/") {
    const dirs = filepath.slice(1).split("/");
    dirs.forEach((el) => {
      const root = paths[paths.length - 1].path;
      const _path = root == "/" ? `/${el}` : `${root}/${el}`;
      paths.push({ name: el, path: _path });

      dir = path.join(dir, el);
    });
  }

  fs.readdirSync(dir).forEach((file) => {
    const isDir = fs.lstatSync(path.join(dir, file)).isDirectory();
    const root = paths[paths.length - 1].path;
    const _path = root == "/" ? `/${file}` : `${filepath}/${file}`;

    if (isDir) dirs.push({ name: file, path: _path });
    else {
      const ext = path.extname(file);
      const arr = [".css", ".html", ".jpg", ".js", ".json", ".png", ".txt"];
      const icon = arr.includes(ext) ? `icon${ext}.svg` : `file_icon.svg`;
      files.push({ name: file, path: _path, icon: `./gfx/${icon}` });
    }
  });

  return { files: files, dirs: dirs, currDir: filepath, paths: paths };
};

const getSystemPath = (filepath) => {
  let directory = path.join(__dirname, "files");
  if (filepath == "/") return directory;
  const dirs = filepath.slice(1).split("/");
  dirs.forEach((el) => (directory = path.join(directory, el)));
  return directory;
};

app.get("/", (_, res) => res.redirect("/login"));
app.get("/login", (req, res) => {
  res.render("login.hbs");
});

app.post("/login", (req, res) => {
  const form = formidable({});
  form.parse(req, (_, f) => {
    const _users = users.filter((user) => {
      return user.login === f.login && user.password === f.password;
    });
    const user = _users.length == 1 ? _users[0] : null;
    if (user) {
      res.cookie("login", user.login, { httpOnly: true, maxAge: 10 * 1000 });
      res.redirect("/filemanager");
    } else res.redirect("/error?err=login-or-pass-not-correct");
  });
});

app.get("/register", (req, res) => {
  res.render("register.hbs");
});

app.post("/register", (req, res) => {
  const form = formidable({});
  form.parse(req, (_, f) => {
    const login = f.login;
    const pwd = f.password;
    const confirmPwd = f.confirmPass;

    if (pwd.length < 3) res.redirect("/error?err=too-short");
    else if (pwd !== confirmPwd)
      res.redirect("/error?err=passwords-do-not-match");
    else if (users.filter((u) => u.login == login).length > 0) {
      res.redirect("/error?err=user-exist");
    } else {
      users.push({ login: login, password: pwd });
      res.redirect("/login");
    }
  });
});

app.get("/error", (req, res) => {
  const err = req.query.err;
  if (err == "too-short")
    res.render("error.hbs", { error: "hasło musi zawierać min. 3 znaki" });
  else if (err == "do-not-match")
    res.render("error.hbs", { error: "hasła nie są zgodne" });
  else if (err == "login-or-pass-not-correct")
    res.render("error.hbs", { error: "niepoprawny login lub hasło" });
  else if (err == "user-exist")
    res.render("error.hbs", { error: "użytkownik o takim loginie istnieje" });
  else res.render("error.hbs", { error: "błąd" });
});

app.get("/logout", (req, res) => {
  res.clearCookie("login");
  res.redirect("/login");
});

app.get("/filemanager", (req, res) => {
  const user = req.cookies.login;
  if (!user) res.redirect("/login");
  const name = req.query.name;
  currDirectory = name;
  if (name) {
    res.render("index.hbs", {
      ...getFiles(name),
      message: message,
      user: user,
    });
  } else
    res.render("index.hbs", { ...getFiles("/"), message: message, user: user });
});

app.post("/filemanager", (req, res) => {
  const dir = getSystemPath(currDirectory);
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: dir,
  });

  form.parse(req, (err, _, files) => {
    if (err) throw err;
    const data = files.data;
    message = Array.isArray(files.data)
      ? `przesłano ${files.data.length} ${
          [2, 3, 4].includes(files.data.length) ? "pliki" : "plików"
        }`
      : "przesłano 1 plik";

    if (Array.isArray(data)) {
      data.forEach((f) => {
        const base = path.parse(f.path).base;
        if (!fs.existsSync(path.join(dir, f.name)))
          try {
            fs.renameSync(path.join(dir, base), path.join(dir, f.name));
          } catch (error) {
            console.error(error);
          }
        else {
          try {
            const date = Date.now();
            const ext = path.extname(f.path);
            const name = ext
              ? `${f.name.replace(ext, "")}_${date}${ext}`
              : `${f.name}_${date}`;
            fs.renameSync(path.join(dir, base), path.join(dir, name));
          } catch (error) {
            console.error(error);
          }
        }
      });
    } else {
      const base = path.parse(data.path).base;
      const ext = path.parse(data.path).ext;
      const name = data.name;

      if (!fs.existsSync(path.join(dir, name)))
        try {
          fs.renameSync(path.join(dir, base), path.join(dir, name));
        } catch (error) {
          console.error(error);
          res.redirect("filemanager");
        }
      else
        try {
          const name = `${name.replace(ext, "")}_${Date.now()}${ext}`;
          fs.renameSync(path.join(dir, base), path.join(dir, name));
        } catch (error) {
          console.error(error);
          res.redirect("filemanager");
        }
    }
    res.redirect(`/filemanager?name=${currDirectory}`);
  });
});

app.get("/new-directory", (req, res) => {
  const dirname = req.query.dirname,
    dir = path.join(getSystemPath(currDirectory), dirname);

  if (dirname) {
    if (fs.existsSync(dir)) message = "katalog o podanej nazwie istnieje";
    else {
      fs.mkdirSync(dir, (err) => {
        if (err) throw err;
      });
      message = "katalog utworzony pomyślnie";
    }
  } else message = "niepoprawna nazwa katalogu";
  res.redirect(`/filemanager?name=${currDirectory}`);
});

app.get("/delete-directory", (req, res) => {
  const directory = getSystemPath(req.query.dir);

  if (fs.existsSync(directory)) {
    if (fs.readdirSync(directory).length == 0) {
      fs.rmdirSync(directory);
      message = "katalog usunięty pomyślnie";
    } else message = "katalog nie jest pusty";
  }
  res.redirect(`/filemanager?name=${currDirectory}`);
});

app.get("/new-file", (req, res) => {
  const filename = req.query.filename,
    dir = getSystemPath(currDirectory),
    filepath = path.join(dir, filename),
    ext = path.parse(filepath).ext;

  let fileContent = "";
  if (ext == ".html")
    fileContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    \n</body>\n</html>`;
  else if (ext == ".css")
    fileContent = `* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}`;
  else if (ext == ".json")
    fileContent = `{\n    "value1": 1,\n    "value2": 2,\n    "value3": 3\n}`;

  if (filename) {
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, fileContent, (err) => {
        if (err) throw err;
      });
      message = "utworzono plik";
    } else {
      const name = path.parse(filepath).name,
        newFileName = `${name}_${Date.now()}${ext}`;
      fs.writeFileSync(path.join(dir, newFileName), fileContent, (err) => {
        if (err) throw err;
      });
      message = "utworzono plik";
    }
  } else message = "niepoprawna nazwa";
  res.redirect(`/filemanager?name=${currDirectory}`);
});

app.get("/delete-file", (req, res) => {
  const file = getSystemPath(req.query.file);
  if (fs.existsSync(file)) fs.rmSync(file);
  message = "plik usunięty pomyślnie";
  res.redirect(`/filemanager?name=${currDirectory}`);
});

app.get("/rename-directory", (req, res) => {
  const pathname = req.query.path,
    newName = req.query.name,
    oldName = pathname.split("/").pop(),
    root = pathname.replace(`/${oldName}`, ""),
    oldPath = path.join(getSystemPath(root), oldName),
    newPath = path.join(getSystemPath(root), newName);

  currDirectory = root;

  if (!fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath, (err) => {
      if (err) console.error(err);
    });
    message = "zmieniono nazwę katalogu";
  } else message = "katalog o podanej nazwie istnieje";
  res.redirect(`/filemanager?name=${currDirectory}`);
});

app.get("/rename-file", (req, res) => {
  const dir = getSystemPath(currDirectory),
    oldPath = path.join(dir, req.query.oldName),
    newPath = path.join(dir, req.query.newName);

  if (!fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath, (err) => {
      if (err) console.error(err);
    });
    message = "zmieniono nazwę pliku";
  } else message = "plik o podanej nazwie istnieje";
  res.redirect(`/filemanager?name=${currDirectory}`);
});

app.get("/show-file", (req, res) => {
  const file = req.query.file,
    fileName = file.split("/").pop(),
    filePath = getSystemPath(file);

  res.render("file.hbs", {
    file: {
      name: fileName,
      root: file.replace(`${fileName}`, ""),
      path: file,
      content: fs.readFileSync(filePath),
    },
  });
});

app.post("/save-file", (req, res) => {
  const form = formidable({});
  form.parse(req, (err, file) => {
    if (err) throw err;

    const dir = getSystemPath(currDirectory);
    fs.writeFile(path.join(dir, file.name), file.content, (err) => {
      if (err) throw err;
      message = "plik zapisany poprawnie";
      res.redirect(`/filemanager?name=${currDirectory}`);
    });
  });
});

app.post("/save-style", (req, res) => {
  const form = formidable({});
  form.parse(req, (err, data) => {
    if (err) throw err;

    fs.writeFile(
      path.join(__dirname, "static", "themes.config.json"),
      JSON.stringify(data),
      (err) => {
        if (err) throw err;
      }
    );
    res.redirect(`/filemanager?name=${currDirectory}`);
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
      isHome: (el) => el == "/",
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
