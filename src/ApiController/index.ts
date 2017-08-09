import Deps from "../Deps";
import {Router, Response} from "express";
import * as cors from 'cors';
import CreditsController from './CreditsController';
import PlayersController from './PlayersController';

export default class ApiRouter {
  public router: Router;

  constructor(deps: Deps) {
    this.router = Router();
    this.router.use(cors());

    this.router.use('/credits', new CreditsController(deps).router);
    this.router.use('/players', new PlayersController(deps).router);
    this.router.get('/', (_req: any, res: Response) => {
      res.send({description: 'OPC API'})
    });
  }
}