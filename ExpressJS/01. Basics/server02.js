const express = require("express");
const app = express();
const PORT = 3000;

const path = require("path");

app.get("/", function (req, res) {
  console.log(`ścieżka do katalogu głównego aplikacji: ${__dirname}`);
  res.send(`
    <p>ścieżka do katalogu głównego aplikacji: ${__dirname}</p>
    <a href="/index1">index 1</a>
    <a href="/index2">index 2</a>
    <a href="/index3">index 3</a>
    <p></p>
  `);
});

app.get("/index1", function (req, res) {
  res.sendFile(path.join(__dirname, "/static/pages/index1.html"));
  console.log(`${__dirname}/static/pages/index1.html`);
});

app.get("/index2", function (req, res) {
  res.sendFile(path.join(__dirname, "/static/pages/index2.html"));
  console.log(`${__dirname}/static/pages/index2.html`);
});

app.get("/index3", function (req, res) {
  res.sendFile(path.join(__dirname, "/static/pages/index3.html"));
  console.log(`${__dirname}/static/pages/index3.html`);
});

app.use(express.static("static"));
app.listen(PORT, function () {
  console.log(`http://localhost:${PORT}`);
});
