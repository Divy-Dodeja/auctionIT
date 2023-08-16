const path = require("path");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const config = require("../config");

const transport = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  auth: {
    user: config.mail.username,
    pass: config.mail.password,
  },
});

const welcomeEmailTemplatePath = path.join(
  __dirname,
  "..",
  "templates",
  "welcomeMailer.ejs"
);

const commanConfig = {
  from: "chirag@mailer.bar",
};

/**
 * Send Email
 * @param {String} to email to 
 * @param {String} subject Subject of email
 * @param {String} html body of mail
 * @returns {Promise}
 */
const sendEmail = (to, subject, html) => {
  return transport.sendMail({ to, subject, html, ...commanConfig });
};

/**
 * Send welcome email to user
 * @param {Object<User>} user user object
 * @returns {Promise}
 */
const sendWelcomeMail = async (user) => {
  const html = await ejs.renderFile(welcomeEmailTemplatePath, { user });
  return sendEmail(user.email, "Welcome To Task Manager App", html);
};

module.exports = {
  sendEmail,
  sendWelcomeMail,
};
