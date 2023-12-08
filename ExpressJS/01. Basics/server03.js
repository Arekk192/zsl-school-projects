const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", function (req, res) {
  console.log(req.query);
  const count = req.query.count;
  const background = req.query.background;

  const style = `
    width: 100%;
    aspect-ratio: 1;
    background: ${background};  
    border-radius: 12px;
    color: #fff;
    font-size: 24px;
    display: flex; 
    align-items: center;
    justify-content: center;
  `;

  let t = [];
  for (let i = 0; i < count; i++)
    t.push(`<div style="${style}">${i + 1}</div>`);

  const containerStyle = `
    width: 100%;
    display: grid; 
    grid-template-columns: repeat(6, 1fr); 
    gap: 12px;  
  `;

  res.send(`<div style="${containerStyle}">${t.join("")}</div>`);
});

app.use(express.static("static"));
app.listen(PORT, function () {
  console.log(`http://localhost:${PORT}?count=20&background=green`);
});
