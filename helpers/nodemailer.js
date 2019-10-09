"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mprasetiodc.official@gmail.com',
    pass: process.env.GOOGLE_EMAIL_PASS
  }
});

const mailOptions = {
  from: 'mprasetiodc.official@gmail.com',
  to: '',
  subject: "You have invited!"
}

module.exports = { mailOptions, transporter }
