import Deps from "./Deps";
import {Router, Response} from "express";
import * as cors from 'cors';
import PlayersController from './Controllers/PlayersController';
import CardsController from './Controllers/CardsController';
import MachinesController from './Controllers/MachinesController';
// import CreditsController from './Controllers/CreditsController';
// import DeviceController from './Controllers/DeviceController';
// import TransactionsController from './Controllers/TransactionsController';

// import LoginController from './Controllers/LoginController';

export default class ApiRouter {
  public router: Router;

  constructor(deps: Deps) {
    this.router = Router();
    this.router.use(cors());

    this.router.use('/players', new PlayersController(deps).router);
    this.router.use('/cards', new CardsController(deps).router);
    this.router.use('/machines', new MachinesController(deps).router);
    // this.router.use('/credits', new CreditsController(deps).router);

    // this.router.use('/device', new DeviceController(deps).router);
    // this.router.use('/transactions', new TransactionsController(deps).router);

    // this.router.use('/login', new LoginController(deps).router);
    this.router.get('/', (_req: any, res: Response) => {
      res.send({description: 'coinmech api'})
    });
    this.router.all('*', (_req: any, res: Response) => {
      res.status(404).send({error: 'Route Not Found'});
    })
  }
}