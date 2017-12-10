import Deps from '../Deps';
import {Router, Request, Response, NextFunction} from 'express';
import P = require('pino');
import {Repository} from 'typeorm';
import {User} from '../entity/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface JwtToken {
  email: string;
}

export default class UsersController {
  private logger: P.Logger;
  public router: Router;
  private userRepository: Repository<User>;
  private jwtSecret: string;

  constructor(deps: Deps) {
    this.router = Router();
    this.jwtSecret = deps.config.jwtHmacSecret;
    this.logger = deps.logger.child({});
    this.userRepository = deps.userRepository;
    this.authorizeMiddleware = this.authorizeMiddleware.bind(this);
    this.requireUserMiddleware = this.requireUserMiddleware.bind(this);
    this.router.post('/', this.registerUser.bind(this));
    this.router.post('/login', this.login.bind(this));
  }

  private createUser(email: string, password: string) {
    return bcrypt.hash(password, 10)
      .then(hashedPassword => {
        console.log('saving', email, hashedPassword.length);
        const user = new User(email, hashedPassword);
        return this.userRepository.save(user);
      });
  }

  authorizeMiddleware(req: Request, res: Response, next: NextFunction) {
    req.isAuthenticated = false;
    const authorizationHeader = req.get('authorization');
    if (!authorizationHeader) {

      return next();
    }
    const matches = authorizationHeader.match(/Bearer (.*)/);
    if (!matches) {
      return next();
    }

    return this.verifyToken(matches[1])
      .then(user => {
        req.user = user;
        req.isAuthenticated = true;
        return next();
      })
      .catch(err => {
        return next();
      });
  }

  requireUserMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated) {
      return res.sendStatus(403);
    }

    return next();
  }

  registerUser(req: Request, res: Response) {
    const {email, password} = req.body;
    this.userRepository.findOne({email})
      .then((existing: User) => {
        if (existing) {
          return res.send('Email address already used');
        }

        return this.createUser(email, password)
          .then(user => {
            return res.send(user);
          });
      })
      .catch(error => {
        console.error(error);
        res.send('Error creating user');
      })
  }

  private generateToken(user: User) {
    return jwt.sign({
      email: user.email
    } as JwtToken, this.jwtSecret, {
      expiresIn: '7d'
    });
  }

  verifyToken(token: string) {
    return Promise.resolve(token)
      .then(token => {
        const data = jwt.verify(token, this.jwtSecret) as JwtToken;
        return this.userRepository.findOne({email: data.email});
      });
  }

  login(req: Request, res: Response) {
    const {email, password} = req.body;

    this.userRepository.findOne({email})
      .then(user => {
        return bcrypt.compare(password, user ? user.password : 'usernotfound')
          .then(correct => {
            if (!correct) {
              throw new Error(`Invalid password for user ${email}`);
            }

            return user;
          })
      })
      .then(user => {
        const token = this.generateToken(user);
        res.send({token});
      })
      .catch(err => {
        console.error(err);
        return res.send('Incorrect username or password');
      })
  }
};