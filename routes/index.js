var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("../passport-config");
const isAuth = require("../middleware/authMiddleware").isAuth;
const isNotAuth = require("../middleware/authMiddleware").isNotAuth;

initializePassport(passport, getUserByUsername, getUserById);

router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

router.get("/", isAuth, async (req, res) => {
  console.log(req.app.locals);
  let user = await req.user;
  res.render("index", {
    title: "Book Directory",
    username: user.username,
    loggedin: req.isAuthenticated() ? true : false,
  });
});

router.get("/login", isNotAuth, (req, res) => {
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

router.get("/register", isNotAuth, (req, res) => {
  res.render("register");
});

router.post("/register", isNotAuth, async (req, res, next) => {
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
