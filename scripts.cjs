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

app.get("/detail/:id", async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    try { 
        if (!listing) {
            res.status(404).send("Listing not found");
        } else {    
            res.render("detail", { listing });
        }
    } catch (err) {
        console.error("Error fetching listing", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});