// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
// const app = require("express")();
// const { WebClient } = require("@slack/web-api");
// const { createEventAdapter } = require("@slack/events-api");

// const slackEvents = createEventAdapter(process.env.SLACK_SIGNIN_SECRET);
// const slackClient = new WebClient(process.env.SLACK_TOKEN);

// slackEvents.on("app_mention", (event) => {
//   console.log(`Got message from user ${event.user}: ${event.text}`);
//   (async () => {
//     try {
//       await slackClient.chat.postMessage({
//         channel: event.channel,
//         text: `Hello <@${event.user}>! :tada:`,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   })();
// });

// slackEvents.on("error", console.error);

// slackEvents.start(3001).then(() => {
//   console.log("Holi en 3001");
// });
