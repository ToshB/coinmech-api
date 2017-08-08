import * as moment from 'moment';
import Deps from "../deps/index";
import {Router, Response} from "express";
import FacebookEventLoader, {FacebookEventResponse} from "../deps/FacebookEventLoader";

interface WebEvent {
  name: string;
  description: string;
  time: Date;
  id: string;
  url: string;
  relativeTime: string;
}

interface EventResponse {
  now: Date;
  upcoming: WebEvent[];
  past: WebEvent[];
}

export default class EventsController {
  public router: Router;
  private facebookEventLoader: FacebookEventLoader;

  constructor(deps: Deps) {
    this.router = Router();
    moment.locale('nb');
    this.facebookEventLoader = deps.facebookEventLoader;
    this.router.get('/', this.getEvents.bind(this));
  }

  getEvents(_req: any, res: Response) {
    this.facebookEventLoader.loadEvents()
      .then(this.prepareEvents)
      .then(events => res.send(events))
      .catch(err => {
        console.error(err);
        res.status(500).send({error: 'Feil ved henting av Facebook-events'});
      });
  }

  prepareEvents(events: FacebookEventResponse): EventResponse {
    console.log('prepare events!');
    const now = new Date();
    return events.data.reduce((acc: EventResponse, e) => {
      const eventDate = new Date(e.start_time);
      let description = e.description.slice(0, 300);
      if (description.length < e.description.length) {
        description += '...';
      }
      const event: WebEvent = {
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
};