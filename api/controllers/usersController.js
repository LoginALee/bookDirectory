var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../../models");
const userModel = db.User;

let User = {};

User.create = async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const { firstName, lastName, username, email } = req.body;
    const user = await userModel.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    res.redirect("/login");
  } catch (err) {
    res.redirect("/register");
    next(err);
  }
};

module.exports = User;
