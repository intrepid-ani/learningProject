const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
// const List = require('./models/list');

app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

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

app.get("/create-list",(req, res) => {
    res.render("list");
});

// app.post("/create-list", async (req, res) => {
//     const { title, description, price, location } = req.body;
//     try {
//         const newListing = new Listing({ title, description, price, location });
//         await newListing.save();
//         res.redirect("/list");
//     } catch (err) {
//         console.error("Error creating listing", err);
//         res.status(500).send("Internal Server Error");
//     }
// });

app.post('/create-list', async (req, res) => {
    try {
        await Listing.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            location: req.body.location,
            country: req.body.country
        });
        
        res.redirect('/');
    } catch (error) {
        console.error('Error creating new list:', error);
        res.status(500).send('Error creating new listing');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});