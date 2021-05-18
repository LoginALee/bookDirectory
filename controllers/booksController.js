const Sequelize = require("sequelize");
const db = require("../models");
const BookModel = db.Book;
const pdf = require("html-pdf");
const mailer = require("../email/mailer");
const getTemplate = require("../helpers/email-template").getTemplate;

let Book = {};

Book.add = async (req, res, next) => {
  try {
    res.render("books/add", { loggedin: req.isAuthenticated() ? true : false });
    res.status(200);
  } catch (err) {
    next(err);
  }
};

Book.create = async (req, res, next) => {
  try {
    const user = await req.user;
    const { title, author, publication_date, abstract, cover } = req.body;
    const userId = await user.id;
    const book = await BookModel.create({
      title,
      author,
      publication_date,
      abstract,
      cover,
      userId,
    });
    const htmlToSend = getTemplate("newBook", {
      username: user.username,
      book: book,
    });
    mailer.sendMail(htmlToSend, user);
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
};

Book.getReport = async (req, res, next) => {
  try {
    const user = await req.user;
    const books = await BookModel.findAll({ where: { userId: user.id } });
    const pdfOptions = {
      height: "11.25in",
      width: "8.5in",
      header: {
        height: "20mm",
      },
      footer: {
        height: "20mm",
      },
    };
    res.render(
      "pdf/report-template",
      {
        username: user.username,
        books: books,
        noHeader: true,
        date: new Date().toDateString(),
      },
      (err, html) => {
        if (err) {
          next(err);
        } else {
          pdf
            .create(html, pdfOptions)
            .toFile("views/pdf/report.pdf", (err, data) => {
              if (err) {
                next(err);
              } else {
                res.send("Report created");
                res.status(200);
              }
            });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

Book.find = async (req, res, next) => {
  try {
    let id = req.params.id;
    const book = await BookModel.findByPk(id);
    res.render("books/edit", { book });
    res.status(200);
  } catch (err) {
    next(err);
  }
};

Book.update = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { title, author, publication_date, abstract, cover } = req.body;
    await BookModel.update(
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
};

Book.preDestroy = async (req, res, next) => {
  try {
    let id = req.params.id;
    const book = await BookModel.findByPk(id);
    res.render("books/delete", {
      title: book.title,
      book,
    });
  } catch (err) {
    next(err);
  }
};

Book.destroy = async (req, res, next) => {
  try {
    let id = req.params.id;
    const user = await req.user;
    const book = await BookModel.findByPk(id);
    await book.destroy();

    const htmlToSend = getTemplate("deletedBook", {
      username: user.username,
      book: book,
    });

    mailer.sendMail(htmlToSend, user);
    res.status(200);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

Book.read = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await req.user;
    const userId = user.id;
    const book = await BookModel.findByPk(id);
    if (book !== null && book.userId !== userId) {
      req.flash("info", "You can interactuare just with your Books");
      res.redirect("/books");
    }
    res.status(200);
    res.render("books/view", { book: book });
  } catch (err) {
    next(err);
  }
};

Book.all = async (req, res, next) => {
  try {
    const user = await req.user;
    const userId = await user.id;
    const books = await BookModel.findAll({ where: { userId: userId } });
    res.status(200);
    res.render("books/index", {
      title: "Books",
      books: books,
      loggedin: req.isAuthenticated() ? true : false,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = Book;
