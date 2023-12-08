const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
// ZADANIE 1
// app.use(express.urlencoded({ extended: true }));

app.use(express.json());

function calculate(data) {
  const value1 = parseInt(data.value1);
  const value2 = parseInt(data.value2);
  switch (data.operation) {
    case "+":
      return { message: "suma", wynik: value1 + value2 };
    case "-":
      return { message: "różnica", wynik: value1 - value2 };
    case "*":
      return { message: "iloczyn", wynik: value1 * value2 };
    case "/":
      return { message: "iloraz", wynik: value1 / value2 };
    case "all":
      return [
        { message: "suma", wynik: value1 + value2 },
        { message: "różnica", wynik: value1 - value2 },
        { message: "iloczyn", wynik: value1 * value2 },
        { message: "iloraz", wynik: value1 / value2 },
      ];
  }
}

app.post("/", (req, res) => {
  res.header("content-type", "application/json");
  res.sendFile(path.join(__dirname, "/static/index.html"));
  const data = req.body;
  console.log(data);
  res.send(JSON.stringify({ data: data.value1 }, null, 4));
});

// app.post("/handleForm", (req, res) => {
//   const data = req.body;
//   res.header("content-type", "application/json");
//   res.send(JSON.stringify(calculate(data), null, 4));
// });

app.use(express.static("static"));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
