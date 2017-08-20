import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import CardRepository from '../Deps/CardRepository';

export default class CardsController {
  public router: Router;
  private cardRepository: CardRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.cardRepository = deps.cardRepository;
    this.router.get('/', this.getCards.bind(this));
  }

  getCards(_req: Request, res: Response) {
    this.cardRepository.getAll()
      .then(cards => res.send({cards}))
      .catch(e => res.status(500).send(e.message));
  }

  // addFunds(req: Request, res: Response) {
  //   const playerId: number = req.params.id;
  //   const {amount} = req.body;
  //   this.cardRepository.get(playerId)
  //     .then(player => this.cardRepository.addFunds(player, amount))
  //     .then(player => res.send(player));
  // }
};