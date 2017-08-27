import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import CardRepository from '../Deps/CardRepository';
import PlayerRepository from '../Deps/PlayerRepository';

export default class CardsController {
  public router: Router;
  private cardRepository: CardRepository;
  private playerRepository: PlayerRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.cardRepository = deps.cardRepository;
    this.playerRepository = deps.playerRepository;
    this.router.get('/', this.getCards.bind(this));
    this.router.post('/', this.scanCard.bind(this));
    this.router.post('/:id/assignToPlayer', this.assignCard.bind(this));
  }

  scanCard(req: Request, res: Response) {
    const cardId = req.body.data;
    this.cardRepository.addOrUpdate(cardId)
      .then(card => res.send({
        card,
        player: null
      }))
      .catch(e => res.status(500).send(e.message));

  }

  getCards(_req: Request, res: Response) {
    this.cardRepository.getAll()
      .then(cards => res.send({cards}))
      .catch(e => res.status(500).send(e.message));
  }

  assignCard(req: Request, res: Response) {
    const cardId = req.params.id;
    const playerId = req.body.player_id.length ? req.body.player_id : null;
    this.cardRepository.assignToPlayer(cardId, playerId)
      .then(card => res.send(card));
  }
};