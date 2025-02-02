const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.models.js");
const customError = require("./utils/customError.utils.js");
const wrapAsync = require("./utils/wrapAsync.utils.js");
const listingSchema = require("./utils/listingSchema.utils.js");

const app = express();
const port = 8000;
const dir = __dirname;

// Middleware
app.set("views", path.join(dir, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(dir, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

function validateSchema(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    next(new customError(400, error));
  }
  console.log(listingSchema.validate(req.body));
  next();
}

// Database Connection
async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/WonderLust");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}
connectDB();

mongoose.connection.on("error", (err) => {
  console.error(`Database connection error: ${err}`);
});

// Routes
// HomePage route
app.get("/", (req, res) => {
  res.redirect("/view-listing");
});

app.get(
  "/view-listing",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    res.render("pages/index.ejs", { listings });
  })
);

app.get(
  "/detail/:id",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new customError(404, "Listing not found");
    res.render("pages/detail.ejs", { listing });
  })
);

app.get("/create-list", (req, res) => {
  res.render("pages/list.ejs");
});

app.post(
  "/create-list",
  validateSchema,
  wrapAsync(async (req, res) => {
    const dataInstant = await Listing.create(req.body);
    res.redirect(`/detail/${dataInstant._id}`);
  })
);

app.get(
  "/detail/:id/edit",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new customError(404, "Listing not found");
    res.render("pages/edit.ejs", { listing });
  })
);

app.put(
  "/detail/:id",
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

app.delete(
  "/detail/:id",
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/view-listing");
  })
);

app.all("*", (req, res, next) => {
  next(new customError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("pages/error.ejs", { status, message });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
