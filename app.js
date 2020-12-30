require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport-setup");

app.use(
  cookieSession({
    name: "oauth2-session",
    keys: ["key1", "key2"],
  })
);

app.set("view engine", "ejs");

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get("/", (req, res) => res.render("pages/index"));
app.get("/auth/failure", (req, res) => res.send("FAILED TO AUTHENTICATE"));

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("pages/profile", {
    name: req.user.displayName,
    pic: req.user.photos[0].value,
    email: req.user.emails[0].value,
  });
});

// Auth Routes
app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/failure",
  })
);
app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

app.listen(5000, () => console.log(`Example app listening on port ${5000}!`));
