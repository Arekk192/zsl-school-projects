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

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/add", (req, res) => {
  res.render("add.hbs");
});

app.post("/add", (req, res) => {
  const data = req.body.data;
  let object = {};

  switch (typeof data) {
    case "object":
      object = {
        insuranced: data.includes("insuranced") ? "tak" : "nie",
        gasoline: data.includes("gasoline") ? "tak" : "nie",
        damaged: data.includes("damaged") ? "tak" : "nie",
        fourwheeled: data.includes("fourwheeled") ? "tak" : "nie",
      };
      break;
    case "string":
      object = {
        insuranced: data == "insuranced" ? "tak" : "nie",
        gasoline: data == "gasoline" ? "tak" : "nie",
        damaged: data == "damaged" ? "tak" : "nie",
        fourwheeled: data == "fourwheeled" ? "tak" : "nie",
      };
      break;
    case "undefined":
      object = {
        insuranced: "nie",
        gasoline: "nie",
        damaged: "nie",
        fourwheeled: "nie",
      };
      break;
  }

  coll.insert(object, function (err, doc) {
    res.render("add.hbs", { message: `Added new object with id: ${doc._id}` });
  });
});

app.get("/list", (req, res) => {
  coll.find({}, (err, docs) => {
    res.render("list.hbs", { data: docs });
  });
});

app.get("/delete", (req, res) => {
  coll.find({}, (err, docs) => {
    res.render("delete.hbs", { data: docs });
  });
});

app.post("/deleteselected", (req, res) => {
  let removed = "";
  switch (typeof req.body.delete) {
    case "object":
      const ids = req.body.delete;
      ids.forEach((id) => {
        coll.remove({ _id: id }, { multi: true });
      });
      removed = `removed ${ids.length} cars`;
      break;
    case "string":
      coll.remove({ _id: req.body.delete }, { multi: true });
      removed = "removed 1 car";
      break;
    case "undefined":
      break;
  }

  coll.find({}, (err, docs) => {
    res.render("delete.hbs", { data: docs, removed: removed });
  });
});

app.post("/deletecars", (req, res) => {
  coll.find({}, (err, docs) => {
    docs.map((car) => {
      coll.remove({ _id: car._id }, { multi: true });
    });
    res.render("delete.hbs", {
      data: [],
      removed: `removed ${docs.length} cars`,
    });
  });
});

app.post("/deletecar", (req, res) => {
  coll.remove({ _id: req.body.id }, { multi: true });
  coll.find({}, (err, docs) => {
    res.render("delete.hbs", { data: docs, removed: "removed 1 car" });
  });
});

app.get("/edit", (req, res) => {
  coll.find({}, (err, docs) => {
    res.render("edit.hbs", { data: docs });
  });
});

app.post("/edit", (req, res) => {
  if (req.body.insuranced) {
    let message = "";
    coll.update(
      { _id: req.body.id },
      {
        insuranced: req.body.insuranced,
        gasoline: req.body.gasoline,
        damaged: req.body.damaged,
        fourwheeled: req.body.fourwheeled,
      },
      {},
      (err) => {
        if (err) console.error(err);
      }
    );
    coll.find({}, (err, docs) => {
      res.render("edit.hbs", { data: docs, message: message });
    });
  } else {
    coll.find({}, (err, docs) => {
      const data = docs.map((car) => {
        return { edit: req.body.id == car._id, ...car };
      });
      res.render("edit.hbs", { data: data });
    });
  }
});

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({ extname: ".hbs", partialsDir: "views/partials" }));
app.set("view engine", "hbs");
app.use(express.static("static"));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
