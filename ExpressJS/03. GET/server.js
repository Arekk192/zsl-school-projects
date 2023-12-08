const { query } = require("express");
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// DO ZADANIA 1 I 2
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "/static/index.html"));
// });

// ZADANIE 1
// app.get("/handleForm", (req, res) => res.send(req.query));

// ZADANIE 2
// app.get("/handleForm", (req, res) => {
//   const color = req.query.kolor;
//   res.send(
//     `<div style="margin: 0; padding: 0; width: 100%; height: 100vh; background-color: ${color}; font-size: 10rem; color: white; display: flex; align-items: center; justify-content: center;">${color}</div>`
//   );
// });

// ZADANIE 3
const data = ["audi", "opel", "mercedes", "fiat", "seat", "auto"];
app.get("/", (req, res) => {
  let d = data.map((el, i) => {
    return `<tr>
        <td>${i + 1}</td>
        <td>${el}</td> 
        <td><input type="radio" name="value${i}" value="new"/></td>
        <td><input type="radio" name="value${i}" value="used"/></td>
        <td><input type="radio" name="value${i}" value="broken"/></td>
    </tr>`;
  });
  res.send(
    `<form method="GET" action="">
        <table>
            <tr>
                <td></td><td></td>
                <td>nowych</td>
                <td>używanych</td>
                <td>powypadkowych</td>
            </tr>
            ${d.join("")}
        </table>
        <button type="submit">submit</button>
    </form>`
  );

  const formData = Object.values(req.query);
  const answer = {};
  for (let i = 0; i < formData.length; i++) {
    switch (formData[i]) {
      case "new":
        answer.new ? answer.new++ : (answer.new = 1);
        break;
      case "used":
        answer.used ? answer.used++ : (answer.used = 1);
        break;
      case "broken":
        answer.broken ? answer.broken++ : (answer.broken = 1);
        break;
    }
  }
  console.log(answer);
});

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
