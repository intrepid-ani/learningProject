const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

function ConnectDB() {
    mongoose.connect('mongodb://localhost:27017/WonderLust')
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((err) => {
            console.log("ERROR: ", err);
        });
}
ConnectDB();


app.get("/", async (req, res) => {
    const listings = await Listing.find();
    res.render("index", { listings });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});

