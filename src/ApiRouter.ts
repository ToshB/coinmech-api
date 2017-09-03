import Deps from "./Deps";
import {Router, Response} from "express";
import * as cors from 'cors';
import PlayersController from './Controllers/PlayersController';
import CardsController from './Controllers/CardsController';
import MachinesController from './Controllers/MachinesController';
import LoginController from './Controllers/LoginController';
import TransactionsController from './Controllers/TransactionsController';
import DevicesController from './Controllers/DevicesController';
import DummyDataController from './Controllers/DummyDataController';

export default class ApiRouter {
  public router: Router;

  constructor(deps: Deps) {
    this.router = Router();
    this.router.use(cors());

    this.router.use('/players', new PlayersController(deps).router);
    this.router.use('/cards', new CardsController(deps).router);
    this.router.use('/machines', new MachinesController(deps).router);
    this.router.use('/login', new LoginController(deps).router);
    this.router.use('/transactions', new TransactionsController(deps).router);
    this.router.use('/devices', new DevicesController(deps).router);

    this.router.use('/generate', new DummyDataController(deps).router);

    this.router.get('/', (_req: any, res: Response) => {
      res.send({description: 'coinmech api'})
    });
    this.router.all('*', (_req: any, res: Response) => {
      res.status(404).send({error: 'Route Not Found'});
    })
  }
}