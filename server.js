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
    console.log(result)
  const card = GenCard(result) 
  return res.send(card);
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


function GenCard(params) {
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
h2 {
    text-align: center;
}
.card {
  margin: auto;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  width: 40%;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.container {
  padding: 2px 16px;
}
</style>
</head>
<body>

<h2>${params.name}</h2>

<div class="card">
  <img src="${params.picture}" alt="Avatar" style="width:100%">
  <div class="container">
    <h4><b>${params.email}</b></h4> 
    <p>charming human</p> 
  </div>
</div>

</body>
</html> 
`
}