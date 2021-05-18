const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("../helpers/passport-config");
const isAuth = require("../middleware/authMiddleware").isAuth;

router.get("/", isAuth, async (req, res) => {
  let user = await req.user;
  res.render("index", {
    title: "Book Directory",
    username: user.username,
    loggedin: req.isAuthenticated() ? true : false,
  });
});

module.exports = router;
