const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../models");
const pdf = require("html-pdf");
const Book = require("../controllers/booksController");
const isAuth = require("../middleware/authMiddleware").isAuth;

router.get("/add", isAuth, Book.add);

router.post("/add", isAuth, Book.create);

router.get("/generate-report", isAuth, Book.getReport);

router.get("/edit/:id", isAuth, Book.edit);

router.post("/edit/:id", isAuth, Book.update);

router.get("/destroy/confirm/:id", isAuth, Book.preDestroy);

router.post("/destroy/confirm/:id", isAuth, Book.destroy);

router.get("/:id", isAuth, Book.read);

router.get("/", isAuth, Book.all);

module.exports = router;
