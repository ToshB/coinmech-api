import Deps from "../Deps";
import {Router, Request, Response} from "express";
import CreditsRepository from '../Deps/CreditsRepository';

export default class CreditsController {
  public router: Router;
  private creditsRepository: CreditsRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.creditsRepository = deps.creditsRepository;
    this.router.get('/', this.getCredits.bind(this));
    this.router.post('/', this.updateCredits.bind(this));
  }

  getCredits(req: Request, res: Response) {
    const userId = parseInt(req.query.userId, 10);
    this.creditsRepository.getUser(userId)
      .then(user => res.send(user));
  }

  updateCredits(req: Request, res: Response) {
    const userId = parseInt(req.body.data, 10);
    this.creditsRepository.subtractAmount(userId, 10)
      .then(result => res.send(result));
  }
};