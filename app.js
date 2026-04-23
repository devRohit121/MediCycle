if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
let port = 8080;
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo").default; 
const flash = require("connect-flash");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");

const User = require("./models/user.js");

const batchRoutes = require("./routes/batchRoute.js");
const orderRoutes = require("./routes/orderRoute.js");
const authRoutes = require("./routes/authRoute.js");
const sellerRoutes = require("./routes/sellerRoute.js");
const cartRoutes = require("./routes/cartRoute.js");
const adminRoutes = require("./routes/adminRoute.js");

const dbURL = process.env.ATLASDB_URL;

console.log("MongoStore:", MongoStore);
console.log("dbURL:", dbURL);

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET  ,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;

  next();
});

passport.use(new LocalStrategy(
  { usernameField: "email" },
  User.authenticate()
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(dbURL)
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

 

app.use("/batches", batchRoutes);
app.use("/orders", orderRoutes);
app.use("/", authRoutes);
app.use("/seller", sellerRoutes);
app.use("/cart", cartRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.redirect("/batches");
});

app.listen(port, () => {
    console.log("server is running on port 8080");
});
