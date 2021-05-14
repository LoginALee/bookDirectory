var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("../passport-config");

initializePassport(passport, getUserByUsername, getUserById);

router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.get("/", checkAuth, (req, res) => {
  res.render("index", {
    title: "Book Directory",
    loggedin: req.isAuthenticated() ? true : false,
  });
});

router.get("/login", checkNotAuth, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", checkNotAuth, (req, res) => {
  res.render("register");
});

router.post("/register", checkNotAuth, async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const { firstName, lastName, username, email } = req.body;
    const user = await db.User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

async function getUserByUsername(username) {
  const userByUsername = await db.User.findOne({
    where: { username: username },
  });
  return userByUsername;
}

async function getUserById(id) {
  const userByid = await db.User.findByPk(id);
  return userByid;
}

module.exports = router;
