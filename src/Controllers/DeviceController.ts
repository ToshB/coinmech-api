import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import CardRepository from '../Deps/CardRepository';
import PlayerRepository from '../Deps/PlayerRepository';

export default class DeviceController {
  public router: Router;
  private cardRepository: CardRepository;
  private playerRepository: PlayerRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.cardRepository = deps.cardRepository;
    this.playerRepository = deps.playerRepository;
    this.router.post('/scan', this.scan.bind(this));
  }

  scan(req: Request, res: Response) {
    const body = req.body;
    const cardId = body.data;
    if (!cardId) {
      res.status(400).send({error: 'data required'});
    }

    Promise.all([
      this.cardRepository.check(cardId),
      this.playerRepository.getByCard(cardId)
    ])
      .then(([card, player]) => res.send({
        cardId: card.id,
        balance: card.balance,
        name: player ? player.name : null
      }))
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