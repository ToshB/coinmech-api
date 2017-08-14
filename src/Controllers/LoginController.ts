import Deps from '../Deps';
import {Router, Request, Response} from 'express';

export default class LoginController {
  public router: Router;

  constructor(_deps: Deps) {
    this.router = Router();
    this.router.post('/', this.login.bind(this));
  }

  login(_req: Request, res:Response) {
    //const {username, password} = req.body;
    res.status(401).send({error: 'Invalid password'});
  }
};