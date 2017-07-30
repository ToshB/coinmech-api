const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const initApi = require('./api');

const config = {
  port: process.env.PORT || 4000,
  facebook: {
    appId: process.env.FACEBOOK_APPID,
    secret: process.env.FACEBOOK_SECRET
  }
};

app.use(bodyParser.json());
app.use(initApi({config}));

app.listen(config.port, function () {
  console.log(`API running on http://localhost:${config.port}`);
});