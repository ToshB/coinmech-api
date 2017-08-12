import Deps from "../Deps/index";
import {Router} from 'express';

class DatabaseController {
  router: Router;

  constructor(_deps: Deps) {
    this.router = Router();
  }
}

export default DatabaseController;
