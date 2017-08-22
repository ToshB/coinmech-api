import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import {sign} from 'jsonwebtoken';

export default class LoginController {
  public router: Router;
  public adminUsername: string;
  public adminPassword: string;
  public jwtSecret: string;

  constructor(deps: Deps) {
    this.router = Router();
    this.router.post('/', this.login.bind(this));
    this.adminUsername = deps.config.adminUsername;
    this.adminPassword = deps.config.adminPassword;
    this.jwtSecret = deps.config.jwtHmacSecret;
  }

  login(req: Request, res: Response) {
    const {username, password} = req.body;
    if (username === this.adminUsername && password === this.adminPassword) {
      res.send({
        token: sign({username: username}, this.jwtSecret)
      })
    } else {
      res.status(401).send({error: 'Invalid username or password'});
    }
  }
};