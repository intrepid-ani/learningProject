const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const Listing = require('./models/listing.models.js');
const ejsMate = require('ejs-mate');

const app = express();
const port = 8000;

// Middleware
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

// Database Connection
(async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/WonderLust');
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error:", err);
    }
})();

app.get("/", (req, res) =>{ 
    res.render("pages/home.ejs");
})

// Default Page route 
app.get("/view-listing", async (req, res) => {
    try {
        const listings = await Listing.find();
        res.render("pages/index.ejs", { listings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Detail Page
app.get("/detail/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("pages/detail.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Create List property route
app.get("/create-list", (req, res) => {
    res.render("pages/list.ejs");
});

// Create List
app.post("/create-list", async (req, res) => {
    try {
        const dataInstant = await Listing.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            location: req.body.location,
            country: req.body.country
        });
        const id = Listing.findOne({title : dataInstant.title})
        res.redirect(`details/${id}`);
    } catch (err) {
        console.error("Error creating new listing:", err);
        res.status(500).send("Error creating new listing");
    }
});

// Edit List Form
app.get("/detail/:id/edit", async (req, res) => {
    try {
        const id = req.params.id;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("pages/edit.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing for edit:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Update List
app.put("/detail/:id", async (req, res) => {
    try {
        const { title, description, country, location, price } = req.body;
        const id = req.params.id
        await Listing.findByIdAndUpdate(id , {
            title,
            description,
            country,
            location,
            price
        });
        res.redirect(`/detail/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete List
app.delete("/detail/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await Listing.findByIdAndDelete(id);
        res.redirect("/view-listing");
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
