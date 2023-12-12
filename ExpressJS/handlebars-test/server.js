const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const jsondata = require("./base.json");

const PORT = 3000;
const app = express();

let discounts = [];
app.get("/", (req, res) => {
  const query = req.query;

  if (query.discount) {
    if (discounts.includes(parseInt(query.discount))) {
      const array = [];
      discounts = discounts.map((el) => {
        if (el != parseInt(query.discount)) array.push(el);
      });
      discounts = array;
    } else discounts.push(parseInt(query.discount));
  }

  const categories = [];
  const data = jsondata.root.map((el, i) => {
    if (!categories.includes(el.category)) categories.push(el.category);
    return {
      id: i,
      discount: discounts.includes(i),
      discountPrice: (el.price / 2).toFixed(2),
      ...el,
    };
  });

  res.render("index.hbs", {
    data: data.map((el) => {
      const category = query.category;
      if (category && category != "None")
        return el.category == category
          ? { ...el, price: el.price.toFixed(2), enabled: true }
          : { enabled: false };
      else return { ...el, price: el.price.toFixed(2), enabled: true };
    }),
    categories: categories,
    discounts: discounts,
  });
});

app.get("/details", (req, res) => {
  const id = req.query.id;
  res.render("details.hbs", {
    data: jsondata.root[id],
  });
});

app.use(express.static("static"));
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({ defaultLayout: "main.hbs" }));
app.set("view engine", "hbs");
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
