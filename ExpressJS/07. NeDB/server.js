const express = require("express");
const Datastore = require("nedb");
const hbs = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = 3000;
const coll = new Datastore({
  filename: "collection.db",
  autoload: true,
});

// coll.insert(data, function (err, doc) {
//   console.log("document added (object):");
//   console.log(doc);
//   console.log(`id: ${doc._id}`);
// });

app.get("/", (req, res) => {
  coll.find({}, (err, docs) => {
    console.log(docs);
    res.render("view.hbs", {
      message: "",
      values: docs.map((el, i) => {
        return { ...el, index: i + 1 };
      }),
    });
  });
});

app.get("/delete", (req, res) => {
  const ids = req.query.cb;
  let message = "";
  switch (typeof ids) {
    case "object":
      ids.forEach((id) => {
        coll.remove({ _id: id }, { multi: true });
      });
      message = `usunięto ${ids.length} ${
        ids.length >= 5 ? "rekordów" : "rekordy"
      }`;
      break;
    case "string":
      coll.remove({ _id: ids }, { multi: true });
      message = "usunięto 1 rekord";
      break;
    case "undefined":
      message = "nie zaznaczono rekordów";
      break;
  }
  coll.find({}, (err, docs) => {
    console.log(docs);
    res.render("view.hbs", {
      message: message,
      values: docs.map((el, i) => {
        return { ...el, index: i + 1 };
      }),
    });
  });
});

app.get("/restore", (req, res) => {
  const data = [
    { name: "klawiatura", price: 200 },
    { name: "klawiatura", price: 250 },
    { name: "kable", price: 50 },
    { name: "monitor", price: 1000 },
    { name: "mysz", price: 100 },
  ];

  data.forEach((el) => {
    coll.insert(el, (err, data) => {
      console.error(err);
      console.log(data);
    });
  });

  res.send(`przywrócono bazę danych`);
});

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({ defaultLayout: "main.hbs" }));
app.set("view engine", "hbs");
app.use(express.static("static"));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

// coll.remove({ _id: "rRJK5yUUlbai0wlO" }, { multi: true }, () =>
//   console.log("removed")
// );

// coll.find({ _id: "rRJK5yUUlbai0wlO" }, (err, data) => {
//   console.log(data);
// });
