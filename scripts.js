const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const customError = require("./utils/customError.utils.js");
const detail = require("./routers/detail.route.js");
const listing = require("./routers/listing.route.js");

const app = express();
const port = 3000;
const dir = __dirname;

// Middleware
app.set("views", path.join(dir, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(dir, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Database Connection
async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/WonderLust");
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
}
connectDB();

// HomePage route
app.get("/", (req, res) => {
  res.redirect("/listing");
});

// Routes
app.use("/detail", detail);
app.use("/listing", listing);

// 404 Error Handling
app.all("*", (req, res, next) => {
  next(new customError(404, "Page not found!"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  console.error(err.stack); // ✅ Logs full stack trace
  res.status(status).render("pages/error.ejs", { status, message });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
