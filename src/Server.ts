import * as express from 'express';
import * as bodyParser from 'body-parser';
import Deps from './Deps';
import ApiRouter from './ApiRouter';

export default class Server {
  public express: express.Application;
  private deps: Deps;

  constructor(deps: Deps) {
    this.express = express();
    this.middleware();
    this.routes(deps);
    this.deps = deps;
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
  }

  private routes(deps: Deps): void {
    this.express.use('/', new ApiRouter(deps).router);
  }

  public start(): void {
    this.express.listen(this.deps.config.port, () => {
      console.log(`API running on http://localhost:${this.deps.config.port}`)
    })
  }
}
