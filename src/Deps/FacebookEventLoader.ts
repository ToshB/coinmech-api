import Config from "../Config";
import fetch, {Response} from 'node-fetch';

interface FacebookEvent {
  start_time: string;
  description: string;
  name: string;
  id: string;
}

export interface FacebookEventResponse {
  data: FacebookEvent[];
}

export default class FacebookEventLoader {
  private accessToken: string;

  constructor(config: Config) {
    this.accessToken = `${config.facebook.appId}|${config.facebook.secret}`;
  }

  public loadEvents(): Promise<FacebookEventResponse> {
    return fetch(`https://graph.facebook.com/v2.9/oslopinball/events?access_token=${this.accessToken}`)
      .then((result: Response) => {
        return result.json()
          .then(data => {
            if (!result.ok) {
              console.error(data);
              throw new Error(`${result.status} - ${result.statusText}`);
            }
            return data;
          });
      }, (err: NodeJS.ErrnoException) => {
        console.error(err);
        throw new Error(`Error getting events: ${err.message}`);
      });
  }
}