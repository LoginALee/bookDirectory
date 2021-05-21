var express = require("express");
var router = express.Router();
const db = require("../models");

router.get("/add", async (req, res, next) => {
  try {
    res.render("books/add");
    res.status(200);
  } catch (err) {
    next(err);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const { title, author, publication_date, abstract, cover } = req.body;
    let userId = 1;
    await db.Book.create({
      title,
      author,
      publication_date,
      abstract,
      cover,
      userId,
    });
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
});

router.get("/edit/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const book = await db.Book.findByPk(id);
    console.log(book);
    res.render("books/edit", { book });
    res.status(200);
  } catch (err) {
    next(err);
  }
});

router.post("/edit/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const { title, author, publication_date, abstract, cover } = req.body;
    await db.Book.update(
      {
        title,
        author,
        publication_date,
        abstract,
        cover,
      },
      { where: { id } }
    );
    res.redirect("/books");
    res.status(200);
  } catch (err) {
    next(err);
  }
});

router.get("/destroy/confirm/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const book = await db.Book.findByPk(id);
    res.render("books/delete", {
      title: book.title,
      book,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/destroy/confirm/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const response = await db.Book.destroy({ where: { id } });
    res.status(200);
    res.redirect("/books/");
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const book = await db.Book.findByPk(id);
    res.status(200);
    res.render("books/view", { book: book });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const books = await db.Book.findAll();
    res.status(200);
    res.render("books/index", { title: "Books", books: books });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
