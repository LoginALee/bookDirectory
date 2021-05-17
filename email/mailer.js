const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken();

const createTransport = () => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_ACCOUNT,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
      tls: {
        rejectUnauthorized: false,
      },
    },
  });
  return transport;
};

const sendMail = async (view, user) => {
  const transporter = createTransport();
  try {
    const info = await transporter.sendMail({
      from: "Book App <alejandrodxwwe@gmail.com>",
      to: user.email,
      subject: `New notification ${user.username}!`,
      html: view,
    });
  } catch (err) {
    err ? console.log(err) : console.log(res);
  }
  transporter.close();
  return;
};

exports.sendMail = sendMail;
