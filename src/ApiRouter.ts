import Deps from "./Deps";
import {Router, Response} from "express";
import * as cors from 'cors';
import DatabaseController from './Controllers/DatabaseController';
import CreditsController from './Controllers/CreditsController';
import PlayersController from './Controllers/PlayersController';
import TransactionsController from './Controllers/TransactionsController';
import MachinesController from './Controllers/MachinesController';

export default class ApiRouter {
  public router: Router;

  constructor(deps: Deps) {
    this.router = Router();
    this.router.use(cors());

    this.router.use('/db', new DatabaseController(deps).router);
    this.router.use('/credits', new CreditsController(deps).router);
    this.router.use('/players', new PlayersController(deps).router);
    this.router.use('/transactions', new TransactionsController(deps).router);
    this.router.use('/machines', new MachinesController(deps).router);
    this.router.get('/', (_req: any, res: Response) => {
      res.send({description: 'coinmech api'})
    });
    this.router.all('*', (_req: any, res: Response) => {
      res.status(404).send({error: 'Not Found'});
    })
  }
}