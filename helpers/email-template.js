const fs = require("fs");
const path = require("path");
const hbs = require("hbs");

module.exports.getTemplate = (templatename, vars) => {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, `../views/emails/${templatename}.hbs`),
    "utf8"
  );
  const template = hbs.compile(emailTemplateSource);
  const htmlToSend = template(vars);
  return htmlToSend;
};
