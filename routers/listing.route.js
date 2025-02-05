const express = require("express");
const wrapAsync = require("../utils/wrapAsync.utils.js");
const validateListing = require("../models/validate/listing.validate.js");
const Listing = require("../models/listing.models.js");
const customError = require("../utils/customError.utils.js");

const Router = express.Router();

// Get all listings
Router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    res.render("pages/index.ejs", { listings });
  })
);

// Render form to create a new listing
Router.get("/create-list", (req, res) => {
  res.render("pages/list.ejs");
});

// Handle listing creation
Router.post(
  "/create-list",
  validateListing,
  wrapAsync(async (req, res) => {
    try {
      const dataInstant = await Listing.create(req.body);
      res.redirect(`/detail/${dataInstant._id}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).send("Internal Server Error");
    }
  })
);

module.exports = Router;
