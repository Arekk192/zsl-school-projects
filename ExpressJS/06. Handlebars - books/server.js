const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({ defaultLayout: "main.hbs" }));
app.set("view engine", "hbs");

const context = {
  subject: "ćwiczenie 3 - dane z tablicy obiektów",
  books: [
    { title: "Lalka", author: "B Prus", lang: "PL" },
    { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
    { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
    { title: "Homo Deus", author: "Yuval Noah Harari", lang: "CZ" },
  ],
};

app.get("/", (req, res) => {
  const values = {
    values: context.books.length == 0 ? [] : Object.keys(context.books[0]),
  };
  res.render("select.hbs", values);
});

// ZADANIE 4
// app.get("/handle", (req, res) => {
//   const value = req.query.select;
//   const values = [];

//   for (let i = 0; i < context.books.length; i++)
//     values.push(context.books[i][value]);

//   const content = { subject: context.subject, values: values };

//   res.render("view.hbs", content);
// });

app.get("/handle", (req, res) => {
  const value = req.query;
  const arr = [];

  const values = Object.values(value);
  const keys = Object.keys(value);
  const books = context.books;

  for (let i = 0; i < books.length; i++) {
    const obj = [];
    for (let j = 0; j < values.length; j++) {
      if (values[j] == "on")
        obj.push(j == 0 ? books[i][keys[j]] : ` ${books[i][keys[j]]}`);
    }
    arr.push(obj);
  }

  const content = {
    subject: context.subject,
    values: arr,
  };

  res.render("view.hbs", content);
});

app.use(express.static("static"));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
