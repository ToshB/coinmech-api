import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import {sign} from 'jsonwebtoken';

export default class LoginController {
  public router: Router;
  public adminPass: string;
  public jwtSecret: string;

  constructor(deps: Deps) {
    this.router = Router();
    this.router.post('/', this.login.bind(this));
    this.adminPass = deps.config.adminPass;
    this.jwtSecret = deps.config.jwtHmacSecret;
  }

  login(req: Request, res: Response) {
    const {username, password} = req.body;
    if (username === 'admin' && password === this.adminPass) {
      res.send({
        token: sign({username: 'admin'}, this.jwtSecret)
      })
    } else {
      res.status(401).send({error: 'Invalid username or password'});
    }
  }
};