var express = require("express");
var router = express.Router();
const db = require("../models");
const isAuth = require("./authMiddleware").isAuth;
const isNotAuth = require("./authMiddleware").isNotAuth;

router.get("/add", isAuth, async (req, res, next) => {
  try {
    res.render("books/add", { loggedin: req.isAuthenticated() ? true : false });
    res.status(200);
  } catch (err) {
    next(err);
  }
});

router.post("/add", isAuth, async (req, res, next) => {
  try {
    const user = await req.user;
    const { title, author, publication_date, abstract, cover } = req.body;
    const userId = await user.id;
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

router.get("/edit/:id", isAuth, async (req, res, next) => {
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

router.post("/edit/:id", isAuth, async (req, res, next) => {
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

router.get("/destroy/confirm/:id", isAuth, async (req, res, next) => {
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

router.post("/destroy/confirm/:id", isAuth, async (req, res, next) => {
  try {
    let id = req.params.id;
    const response = await db.Book.destroy({ where: { id } });
    res.status(200);
    res.redirect("/books/");
  } catch (err) {
    next(err);
  }
});

router.get("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await req.user;
    const userId = user.id;
    const book = await db.Book.findByPk(id);
    if (book !== null && book.userId !== userId) {
      req.flash("info", "You can interactuare just with your Books");
      res.redirect("/books");
    }
    res.status(200);
    res.render("books/view", { book: book });
  } catch (err) {
    next(err);
  }
});

router.get("/", isAuth, async (req, res, next) => {
  try {
    const user = await req.user;
    const userId = await user.id;
    const books = await db.Book.findAll({ where: { userId: userId } });
    res.status(200);
    res.render("books/index", {
      title: "Books",
      books: books,
      loggedin: req.isAuthenticated() ? true : false,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
