require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios").default;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("is line login");
});

app.get("/line", (req, res) => {
  const url = new URL(process.env.LINE_ME_URL + "/authorize");
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINE_CLIENT_ID,
    redirect_uri: `${process.env.LINE_ENDPOIN}/line/redirect`,
    state: token(),
    scope: "profile openid email",
  }).toString();
  return res.redirect(url.href);
});

app.get("/line/redirect", async (req, res) => {
  const urlToken = process.env.LINE_ME_URL_TOKEN + "/token";
  const urlVerify = process.env.LINE_ME_URL_TOKEN + "/verify";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const bodyToken = new URLSearchParams({
    grant_type: "authorization_code",
    code: req.query.code,
    redirect_uri: `${process.env.LINE_ENDPOIN}/line/redirect`,
    client_id: process.env.LINE_CLIENT_ID,
    client_secret: process.env.LINE_CLIENT_SECRET,
  });
  const dataToken = await axios
    .post(urlToken, bodyToken, { headers })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  const bodyVerify = new URLSearchParams({
    id_token: dataToken.id_token,
    client_id: process.env.LINE_CLIENT_ID,
  });
  const result = await axios
    .post(urlVerify, bodyVerify, { headers })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return res.json(result);
});

const APP_PORT = process.env.APP_PORT || 3000;

app.listen(APP_PORT, () => {
  console.log("server is running... " + APP_PORT);
});

const rand = function () {
  return Math.random().toString(36).substring(2); // remove `0.`
};
const token = function () {
  return rand() + rand(); // to make it longer
};
