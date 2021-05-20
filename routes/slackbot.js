const express = require("express");
const router = express.Router();
const Bot = require("../api/controllers/slackbotController");

router.post("/", Bot.index);

router.post("/add-book", Bot.showBookModal);

router.post("/interactions", Bot.addBook);

router.post("/events", Bot.handleEvents);

module.exports = router;
