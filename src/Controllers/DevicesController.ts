import Deps from '../Deps';
import fetch = require('isomorphic-fetch');
import {Router, Request, Response} from 'express';
import P = require('pino');
import {logAndSend} from '../ErrorHandler';

export default class DevicesController {
  public router: Router;
  private logger: P.Logger;
  private accessToken: string;

  constructor(deps: Deps) {
    this.router = Router();
    this.accessToken = deps.config.particleAccessToken;
    this.logger = deps.logger.child({});
    this.router.get('/:deviceId', this.getStatus.bind(this));
  }

  getStatus(req: Request, res: Response) {
    const deviceId = req.params.deviceId;
    fetch(`https://api.particle.io/v1/devices/${deviceId}?access_token=${this.accessToken}`)
      .then(res => res.json())
      .then(status => res.send(status))
      .catch(logAndSend(this.logger, res));
  }
};