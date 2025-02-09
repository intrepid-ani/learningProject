const express = require("express");
const wrapAsync = require("../utils/wrapAsync.utils.js");
const validateListing = require("../models/validate/listing.validate.js");
const Listing = require("../models/listing.models.js");

const Router = express.Router({ mergeParams: true });
// Get all listings

Router.get(
  "/",
  wrapAsync(async (req, res) => {
    try {
      let listings = await Listing.find();
      res.render("./pages/index.ejs", { listings });
    } catch (err) {
      console.log(err);
    }
  })
);

// Handle listing creation
Router.get("/create-list", (req, res) => {
  res.render("pages/list.ejs");
});

Router.post(
  "/create-list",
  validateListing,
  wrapAsync(async (req, res, next) => {
    try {
      const dataInstant = await Listing.create(req.body);
      req.flash("success", "New listing added!"); // Flash message set
      return res.redirect(`/detail/${dataInstant._id}`); // Ensure correct redirection
    } catch (error) {
      next(error);
    }
  })
);

module.exports = Router;
