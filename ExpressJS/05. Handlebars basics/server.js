const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({ defaultLayout: "main.hbs" }));
app.set("view engine", "hbs");

app.get("/index", (req, res) => {
  res.render("index.hbs");
});

app.get("/login", (req, res) => {
  res.render("login.hbs");
});

app.get("/", (req, res) => {
  res.render("index.hbs", { layout: null });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
