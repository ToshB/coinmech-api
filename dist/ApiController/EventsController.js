"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
moment.locale('nb');
const express_1 = require("express");
class EventsController {
    constructor(deps) {
        this.router = express_1.Router();
        this.facebookEventLoader = deps.facebookEventLoader;
        this.router.get('/', this.getEvents.bind(this));
    }
    getEvents(_req, res) {
        this.facebookEventLoader.loadEvents()
            .then(this.prepareEvents)
            .then(events => res.send(events))
            .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Feil ved henting av Facebook-events' });
        });
    }
    prepareEvents(events) {
        console.log('prepare events!');
        const now = new Date();
        return events.data.reduce((acc, e) => {
            const eventDate = new Date(e.start_time);
            let description = e.description.slice(0, 300);
            if (description.length < e.description.length) {
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
            }
            else {
                acc.past.push(event);
            }
            return acc;
        }, { now, upcoming: [], past: [] });
    }
    ;
}
exports.default = EventsController;
;
//# sourceMappingURL=EventsController.js.map