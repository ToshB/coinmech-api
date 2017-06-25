const express = require('express');
const app = express();
const initApi = require('./api');

const config = {
  facebook: {
    appId: process.env.FACEBOOK_APPID,
    secret: process.env.FACEBOOK_SECRET
  }
}

app.use(initApi({config}));

app.listen(4000, function () {
  console.log('Example app listening on http://localhost:4000')
});