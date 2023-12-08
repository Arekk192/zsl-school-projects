const express = require("express")
const app = express()
const PORT = 3000;

app.use(express.static('static'))
app.listen(PORT, function () {
    console.log(`http://localhost:${PORT}`);
})
