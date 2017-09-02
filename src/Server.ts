import * as express from 'express';
import * as bodyParser from 'body-parser';
import Deps from './Deps';
import ApiRouter from './ApiRouter';
import EventHandler from './EventHandler';

export default class Server {
  public express: express.Application;
  private deps: Deps;
  private eventHandler: EventHandler;

  constructor(deps: Deps) {
    this.express = express();
    this.registerMiddleware();
    this.registerRoutes(deps);
    this.deps = deps;
    this.eventHandler = new EventHandler(deps);
  }

  private registerMiddleware(): void {
    this.express.use(bodyParser.json());
  }

  private registerRoutes(deps: Deps): void {
    this.express.use('/', new ApiRouter(deps).router);
  }

  public start(): void {
    this.express.listen(this.deps.config.port, () => {
      console.log(`API running on http://localhost:${this.deps.config.port}`)
    })
  }
}
