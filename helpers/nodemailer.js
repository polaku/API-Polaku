"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'polaku.digital@gmail.com',
    pass: process.env.GOOGLE_EMAIL_PASS,
    accessToken: 'AIzaSyCrY_NuYWUkTN4DavcwxbDH-HAE3cb8ERc',
  }
});

const mailOptions = {
  from: 'Polaku <noreply.polaku.digital@gmail.com>',
  to: '',
}

module.exports = { mailOptions, transporter }
