const fs = require("fs");
const express = require("express");
const path = require("path");

const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
  // res.send(filenames.map((el) => `<a href="${el}">${el}</a>`).join("<br />"));
  // res.sendFile(path.join(__dirname, "static/tasks/cw-01.html"));
});

app.get("/files", (req, res) => {
  const directories = fs.readdirSync(`${__dirname}/static`);

  res.send(
    directories
      .map((dir) => {
        return {
          name: dir,
          files: fs.readdirSync(`${__dirname}/static/${dir}`),
        };
      })
      .reverse()
  );
});

app.use(express.static("static"));
app.use(express.static("static/tasks"));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
