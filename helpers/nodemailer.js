"use strict";
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.SECRET_GMAIL,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
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
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'polaku.digital@gmail.com',
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.SECRET_GMAIL,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
  });

  return transporter;
};


// let transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     type: 'OAuth2',
//     user: 'polaku.digital@gmail.com',
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.SECRET_GMAIL,
//     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//     accessToken: process.env.ACCESS_TOKEN_GMAIL
//   }
// });

const mailOptions = {
  from: 'Polaku <noreply.polaku.digital@gmail.com>',
  to: '',
}

module.exports = { mailOptions, createTransporter }
