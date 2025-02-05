const express = require("express");
const validateReview = require("../models/validate/review.validate.js");
const wrapAsync = require("../utils/wrapAsync.utils.js");
const Listing = require("../models/listing.models.js");
const Review = require("../models/review.models.js");
const customError = require("../utils/customError.utils.js");

const Router = express.Router();

Router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    res.render("pages/detail.ejs", { listing });
  })
);

Router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new customError(404, "Listing not found");
    res.render("pages/edit.ejs", { listing });
  })
);

Router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedListing) throw new customError(404, "Listing not found");
    res.redirect(`/detail/${updatedListing._id}`);
  })
);

Router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listing");
  })
);

Router.post(
  "/:id/review",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const newReview = new Review({ rating, comment });
    await newReview.save();

    let list = await Listing.findById(id);

    if (!list) {
      throw new customError(400, `Bad request (List Not Found)`);
    }
    list.reviews.push(newReview._id);
    await list.save();

    res.redirect(`/detail/${id}`);
  })
);

Router.delete(
  "/:id/review/:reviewid",
  wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewid } },
      { new: true }
    );

    res.redirect(`/detail/${id}`);
  })
);

module.exports = Router;
