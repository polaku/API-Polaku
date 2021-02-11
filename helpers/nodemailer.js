"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'polaku.digital@gmail.com',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET_GMAIL,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN_GMAIL
  }
});

const mailOptions = {
  from: 'Polaku <noreply.polaku.digital@gmail.com>',
  to: '',
}

module.exports = { mailOptions, transporter }
