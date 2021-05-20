const express = require("express");
const router = express.Router();
const { WebClient } = require("@slack/web-api");
const bookModal = require("../../helpers/book-modal");
const db = require("../../models");
const bookModel = db.Book;
const userModel = db.User;

const token = process.env.SLACK_TOKEN;

const web = new WebClient(token, { retries: 0 });

let Bot = {};

Bot.index = (req, res) => {
  res.send(req.body.challenge);
};

Bot.showBookModal = async (req, res) => {
  const { trigger_id: triggerId } = req.body;

  res.status(200).send("");
  (async () => {
    await web.views.open(bookModal(triggerId));
  })();
};

Bot.addBook = (req, res, next) => {
  res.status(200).send();
  const payload = JSON.parse(req.body.payload);

  console.log(payload);

  if (
    payload.type === "view_submission" &&
    payload.view.callback_id === "add-book"
  ) {
    const { values } = payload.view.state;
    const { username } = payload.user;
    values.username = username;
    addBook(values, req, res, next);
  }
};

const addBook = async (values, req, res, next) => {
  try {
    const title = values.title.title.value;
    const author = values.author.author.value;
    const cover = values.cover.cover.value;
    const abstract = values.abstract.abstract.value;
    const publication_date =
      values.publication_date.publication_date.selected_date;
    const user = values.username;

    const findedUser = await userModel.findOne({
      where: { username: user },
    });

    const book = await bookModel.create({
      title,
      author,
      publication_date,
      abstract,
      cover,
      userId: findedUser.id,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

Bot.handleEvents = async (req, res, next) => {
  const message = req.body;
  res.status(200).send();

  if (message.challenge) {
    res.send(req.body.challenge);
  } else if (message.event) {
    console.log(req.body);
    switch (message.event.type) {
      case "app_mention":
        (async () => {
          try {
            await web.chat.postMessage({
              channel: message.event.channel,
              text: `Hello <@${message.event.user}>! :tada:`,
            });
          } catch (err) {
            console.log(err);
          }
        })();
        break;
      default:
        res.send(404);
        break;
    }
  }
};

module.exports = Bot;
