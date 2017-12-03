import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import P = require('pino');
import GoogleAuth = require('google-auth-library');
import {LoginTicket} from 'google-auth-library/types/lib/auth/loginticket';
import {OAuth2Client} from 'google-auth-library/types/lib/auth/oauth2client';
import PlayerRepository, {Player} from '../Deps/PlayerRepository';

const auth = new GoogleAuth();

export default class AuthController {
  private playerRepository: PlayerRepository;
  public router: Router;
  private logger: P.Logger;
  private client: OAuth2Client;
  private clientId: string;

  constructor(deps: Deps) {
    this.clientId = deps.config.google.clientId;
    this.playerRepository = deps.playerRepository;
    this.router = Router();
    this.logger = deps.logger.child({});
    this.client = new auth.OAuth2(this.clientId, '', '');
    this.router.post('/tokensignin', this.tokensignin.bind(this));
  }

  tokensignin(req: Request, res: Response) {
    const {idToken} = req.body;
    this.client.verifyIdToken(idToken, this.clientId, (e, login: LoginTicket) => {
      const payload = login.getPayload();
      this.playerRepository.addOrUpdate(payload.sub, payload.name, payload.email)
        .then((p: Player) => {
          res.send('ok');
        });
    });
  }

};
