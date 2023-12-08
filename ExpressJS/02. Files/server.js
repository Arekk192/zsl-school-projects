const express = require("express");
const app = express();
const PORT = 3000;
const formidable = require("formidable");
const path = require("path");

// app.post("/upload", (req, res) => {
//   let form = formidable({});
//   form.uploadDir = `${__dirname}/static/upload`;
//   form.keepExtensions = true;
//   form.multiples = true;
//   form.parse(req, (err, fields, files) => {
//     if (err) console.log("błąd przesyłania danych");
//     console.log("dane", fields);
//     console.log("pliki", files);

//     console.log({
//       bytesExpected: form.bytesExpected,
//       bytesReceived: form.bytesReceived,
//     });

//     res.send("wysłano");
//   });

//   form.on("file", function () {
//     console.log("file" + new Date().getTime());
//   });

//   form.on("progress", function (bytesReceived, bytesExpected) {
//     console.log(
//       "progress ",
//       bytesExpected,
//       bytesReceived,
//       new Date().getTime()
//     );
//   });

//   form.on("fileBegin", function (name, value) {
//     console.log("fileBegin" + new Date().getTime());
//   });

//   form.on("end", function () {
//     console.log("end" + new Date().getTime());
//   });
// });

app.get("/", (_, res) =>
  res.sendFile(path.join(__dirname, "static/index.html"))
);

// ZADANIE 4
// app.post("/upload", (req, res) => {
//   let form = formidable({});
//   form.uploadDir = `${__dirname}/static/upload`;
//   form.keepExtensions = true;
//   form.multiples = true;

//   form.parse(req, (err, fields, files) => {
//     if (err) console.log("błąd przesyłania danych");
//   });

//   let time;
//   let starttime;
//   const arr = [];

//   form.on("fileBegin", () => {
//     const date = new Date();
//     time = {
//       m: date.getMinutes(),
//       s: date.getSeconds(),
//       ms: date.getMilliseconds(),
//     };
//     starttime = Date.now();
//   });

//   form.on("progress", () => {
//     const date = new Date();
//     arr.push({
//       bytesExpected: form.bytesExpected,
//       bytesReceived: form.bytesReceived,
//       currentTime: `${date.getMinutes()}m, ${date.getSeconds()}s, ${date.getMilliseconds()}ms`,
//     });
//   });

//   form.on("file", () => {
//     const date = new Date();

//     console.log({
//       array: arr,
//       start: time,
//       end: {
//         m: date.getMinutes(),
//         s: date.getSeconds(),
//         ms: date.getMilliseconds(),
//       },
//       fulltime: `${Date.now() - starttime} milliseconds`,
//     });
//   });

//   res.send("przesłano plik");
// });


app.use(express.static("static"));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
