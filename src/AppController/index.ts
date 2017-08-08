import Deps from "../Deps";
import {Router, Request, Response} from "express";
import * as google from 'googleapis';

const plus = google.plus('v1');
const OAuth2 = google.auth.OAuth2;

export default class ApiRouter {
  public router: Router;
  private oauth2Client: any;

  constructor(deps: Deps) {
    this.router = Router();
    this.oauth2Client = new OAuth2(
      deps.config.google.clientId,
      deps.config.google.clientSecret,
      'http://localhost:4000/oauth2callback'
    );

    const scopes = [
      'openid', 'profile', 'email'
    ];

    this.router.get('/', (_req: any, res: Response) => {
        res.render('index', {title: 'Login', message: 'Login'});
      }
    );

    this.router.get('/auth', (_req: any, res: Response) => {
        const url = this.oauth2Client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          //access_type: 'offline',
          scope: scopes
        });
        res.redirect(url);
      }
    );

    this.router.get('/oauth2callback', (req: Request, res: Response) => {
      const code = req.query.code;
      this.oauth2Client.getToken(code, (err: any, tokens: any) => {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (err) {
          console.error(err);
          return res.send({error: err});
        }

        this.oauth2Client.setCredentials(tokens);

        return plus.people.get({
          userId: 'me',
          auth: this.oauth2Client
        }, (err: any, data: any) => {
          if(err){
            console.error(err);
            return res.send({error: err});
          }

          return res.send({
            query: req.query,
            tokens: tokens,
            data
          });
        });
      });
    });
  }
}