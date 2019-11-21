"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'polaku.digital@gmail.com',
    pass: process.env.GOOGLE_EMAIL_PASS
  }
});

const mailOptions = {
  from: 'Polaku <noreply.polaku.digital@gmail.com>',
  to: '',
}

module.exports = { mailOptions, transporter }
