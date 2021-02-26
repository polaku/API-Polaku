"use strict";
require('dotenv').config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
        console.log("Get access token failed")
        console.log(err)
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: 'polaku.digital@gmail.com',
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter;
};


let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'polaku.digital@gmail.com',
    pass: process.env.GOOGLE_EMAIL_PASS
  }
});

const mailOptions = {
  from: 'polaku.digital@gmail.com',
  to: '',
}

module.exports = { mailOptions, createTransporter, transporter }
