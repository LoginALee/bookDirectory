const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { WebClient } = require("@slack/web-api");
const bookModal = require("../../helpers/book-modal");
const registerModal = require("../../helpers/register-modal");
const db = require("../../models");
const bookModel = db.Book;
const userModel = db.User;
const fetch = require("node-fetch");

const token = process.env.SLACK_TOKEN;

const web = new WebClient(token, { retries: 0 });

let Bot = {};

let responseURL;

Bot.index = (req, res) => {
  res.send(req.body.challenge);
  res.status(200).send("");
};

Bot.showBookModal = async (req, res) => {
  res.status(200).send("");
  const { trigger_id: triggerId } = req.body;
  const userInfo = await web.users.info({
    user: req.body.user_id,
  });
  const username = userInfo.user.real_name.trim();

  const user = await checkUserExists(username);
  user === null
    ? (async () => {
        let response = await web.views.open(registerModal(triggerId, userInfo));
      })()
    : (async () => {
        let response = await web.views.open(bookModal(triggerId));
      })();
};

const validateBookForm = (values) => {
  const title = values.title.title.value;
  const author = values.author.author.value;
  const cover = values.cover.cover.value;
  const abstract = values.abstract.abstract.value;
  const publication_date =
    values.publication_date.publication_date.selected_date;
  regexpURL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;

  if (!title || !author || !cover || !abstract || !publication_date) {
    return {
      response_action: "errors",
      errors: {
        channel: "You must fill in all the fields",
      },
    };
  }

  if (!regexpURL.test(cover)) {
    return {
      response_action: "errors",
      errors: {
        cover: "You must enter a valid URL",
      },
    };
  }

  return "";
};

const validateRegisterForm = (values) => {
  const firstName = values.first_name.first_name.value;
  const lastName = values.last_name.last_name.value;
  const username = values.username;
  const email = values.email.email.value;
  const password = values.password.password.value;
  regexEMAIL = /^\S+@\S+$/gm;

  if (!firstName || !lastName || !password || !username || !email) {
    return {
      response_action: "errors",
      errors: {
        channel: "You must fill in all the fields",
      },
    };
  }

  if (!regexEMAIL.test(email)) {
    return {
      response_action: "errors",
      errors: {
        email: "You must enter a valid Email",
      },
    };
  }

  return "";
};

Bot.handleInteractions = async (req, res, next) => {
  const payload = JSON.parse(req.body.payload);
  const { values } = payload.view.state;
  const userInfo = await web.users.info({
    user: payload.user.id,
  });
  responseURL = payload.response_urls[0].response_url;
  values.username = userInfo.user.real_name;
  let validateResponse;

  if (payload.type === "view_submission") {
    switch (payload.view.callback_id) {
      case "add-book":
        validateResponse = validateBookForm(values);
        res.status(200).send(validateResponse);
        if (validateResponse === "") {
          addBook(values, req, res, next);
        }
        break;
      case "add-user":
        validateResponse = validateRegisterForm(values);
        res.status(200).send(validateResponse);
        if (validateResponse === "") {
          addUser(values, req, res, next);
        }
        break;
      default:
        console.log("Unknown interaction");
        return res.status(500).send("Unknown interaction");
    }
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
    let responseMessage = await fetch(responseURL, {
      method: "post",
      body: JSON.stringify({
        text: "Book added successfully! :partying_face:",
        response_type: "ephemeral",
      }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log("Something went wrong creating the book: ", err);
    return res
      .status(500)
      .send("Something went wrong creating the book: ", err);
  }
};

const addUser = async (values, req, res, next) => {
  try {
    const firstName = values.first_name.first_name.value;
    const lastName = values.last_name.last_name.value;
    const username = values.username;
    const email = values.email.email.value;
    const password = await bcrypt.hash(values.password.password.value, 10);
    const user = await userModel.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    let responseMessage = await fetch(responseURL, {
      method: "post",
      body: JSON.stringify({
        text: "You registered successfully! :smile:",
        response_type: "ephemeral",
      }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(responseMessage);
  } catch (err) {
    console.log("Something went wrong during registration ", err);
    return res
      .status(500)
      .send("Something went wrong during registration: ", err);
  }
};

Bot.handleEvents = async (req, res, next) => {
  const message = req.body;

  if (message.event) {
    switch (message.event.type) {
      case "app_mention":
        (async () => {
          try {
            await web.chat.postMessage({
              channel: message.event.channel,
              text: `Hello <@${message.event.user}>! :tada:`,
            });
          } catch (err) {
            console.log("something went wront in the event", err);
            return res.status(500).send("Something went wrong in event: ", err);
          }
        })();
        break;
      default:
        console.log("Unknown event", err);
        return res.status(500).send("Unknown event", err);
    }
  }
  console.log("Unknown event", err);
  return res.status(500).send("Unknown event", err);
};

const checkUserExists = async (user) => {
  try {
    const response = await userModel.findOne({ where: { username: user } });
    return response;
  } catch (err) {
    console.log("Error during user exists", err);
    return err;
  }
};

module.exports = Bot;
