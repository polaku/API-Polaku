"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'polaku.digital@gmail.com',
    accessToken: process.env.GOOGLE_KEY_GMAIL,
  }
});

const mailOptions = {
  from: 'Polaku <noreply.polaku.digital@gmail.com>',
  to: '',
}

module.exports = { mailOptions, transporter }
