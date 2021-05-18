var express = require("express");
const User = require("../api/controllers/usersController");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("../helpers/passport-config");
const isAuth = require("../middleware/authMiddleware").isAuth;
const isNotAuth = require("../middleware/authMiddleware").isNotAuth;
const userHelpers = require("../helpers/user-helpers");

module.exports = function (passport, router) {
  initializePassport(
    passport,
    userHelpers.getUserByUsername,
    userHelpers.getUserById
  );

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

  router.post("/register", isNotAuth, User.create);

  router.get("/logout", (req, res, next) => {
    req.logOut();
    res.redirect("/login");
  });
};
