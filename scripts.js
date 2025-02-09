const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const customError = require("./utils/customError.utils.js");
const detail = require("./routers/detail.route.js");
const listing = require("./routers/listing.route.js");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = 3000;
const dir = __dirname;
const sesOpt = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: Date.now() + 7 * 24 * 60 * 1000 },
};

// Middleware
app.set("views", path.join(dir, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(dir, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(session(sesOpt));
app.use(flash());

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

app.use((req, res, next) => {
  const successMessage = req.flash("success");
  res.locals.success = successMessage;
  successMessage.length ? console.log(successMessage) : null;
  const errorMessage = req.flash("error");
  res.locals.error = errorMessage;
  errorMessage.length ? console.log(errorMessage) : null;
  next();
});

// HomePage route
app.get("/", (req, res) => {
  res.render("./pages/error.ejs");
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
  res.status(status).render("pages/error.ejs", { status, message });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
