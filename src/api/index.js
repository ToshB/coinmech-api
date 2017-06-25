const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const moment = require('moment');
moment.locale('nb');

const prepareEvents = ({data}) => {
  const now = new Date();
  return data.reduce((acc, e) => {
    const eventDate = new Date(e.start_time);
    let description = e.description.slice(0, 300);
    if (description.length < e.desxcription.length) {
      description += '...';
    }
    const event = {
      name: e.name,
      description,
      time: eventDate,
      id: e.id,
      url: `https://www.facebook.com/events/${e.id}`,
      relativeTime: moment(eventDate).fromNow()
    };

    if (eventDate > now) {
      acc.upcoming.push(event);
    } else {
      acc.past.push(event);
    }
    return acc;
  }, {now, upcoming: [], past: []});
};

module.exports = ({config}) => {
  const router = new express.Router();

  router.use(cors());
  router.get('/events', (req, res) => {
    const accessToken = `${config.facebook.appId}|${config.facebook.secret}`;
    fetch(`https://graph.facebook.com/v2.9/oslopinball/events?access_token=${accessToken}`)
      .then(function (res) {
        return res.text();
      })
      .then(JSON.parse)
      .then(prepareEvents)
      .then(events => {
        res.send(events);
      })
      .catch(err => {
        res.status(500).send({error: 'Feil ved henting av Facebook-events', err: err.toString()});
      });
  });

  return router;
};
