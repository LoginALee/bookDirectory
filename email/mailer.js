const nodemailer = require("nodemailer");

const createTransport = () => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "48ae022c783bae",
      pass: "7f3f83cdf867d9",
    },
  });
  return transport;
};

const sendMail = async (view, user) => {
  const transporter = createTransport();
  const info = await transporter.sendMail({
    from: "Book App <alejandrodxwwe@gmail.com>",
    to: user.email,
    subject: `New notification ${user.username}!`,
    html: view,
  });
  console.log("Message sent: %s", info.messageId);

  return;
};

exports.sendMail = sendMail;
