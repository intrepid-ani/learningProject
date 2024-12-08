const express = require('express');
const app = express();
const port = 8000;
const path = require('path');

app.set("veiews", path.join(__dirname, "/veiws"))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app. listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});
