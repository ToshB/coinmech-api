import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import CardRepository, {Card} from '../Deps/CardRepository';
import PlayerRepository from '../Deps/PlayerRepository';
import MachineRepository from '../Deps/MachineRepository';
import TransactionService from '../Deps/TransactionService';
import {BuyCreditEvent, LoadMoneyEvent} from '../Deps/Transactions';

export default class CardsController {
  public router: Router;
  private cardRepository: CardRepository;
  private playerRepository: PlayerRepository;
  private machineRepository: MachineRepository;
  private transactionService: TransactionService;

  constructor(deps: Deps) {
    this.router = Router();
    this.cardRepository = deps.cardRepository;
    this.playerRepository = deps.playerRepository;
    this.transactionService = deps.transactionService;
    this.machineRepository = deps.machineRepository;

    this.router.get('/', this.getCards.bind(this));
    this.router.post('/', this.scanCard.bind(this));
    this.router.post('/:id/assignToPlayer', this.assignCard.bind(this));
    this.router.post('/:id/loadMoney', this.loadMoney.bind(this));
    this.router.post('/:id/buyCredit', this.buyCredit.bind(this));
  }

  scanCard(req: Request, res: Response) {
    const cardId = req.body.data;
    this.cardRepository.addOrUpdate(cardId)
      .then((card: Card) => {
        if (card.playerId) {
          this.playerRepository.get(card.playerId)
            .then(player => res.send({card, player}));
        } else {
          res.send({card, player: null})
        }
      })
      .catch((e: Error) => res.status(500).send(e.message));

  }

  getCards(_req: Request, res: Response) {
    this.cardRepository.getAll()
      .then(cards => res.send({cards}))
      .catch(e => res.status(500).send(e.message));
  }

  assignCard(req: Request, res: Response) {
    const cardId = req.params.id;
    const playerId = req.body.playerId.length ? req.body.playerId : null;
    this.cardRepository.assignToPlayer(cardId, playerId)
      .then(card => res.send(card));
  }

  loadMoney(req: Request, res: Response) {
    const cardId = req.params.id;
    const playerId = req.body.playerId;
    const amount = req.body.amount;

    Promise.resolve()
      .then(() => new LoadMoneyEvent(cardId, playerId, amount))
      .then(transaction => this.transactionService.addTransaction(transaction))
      .then(events => res.send(events))
      .catch(err => res.status(400).send({error: err.message}));
  }

  buyCredit(req: Request, res: Response) {
    const cardId = req.params.id;
    const playerId = req.body.playerId;
    const machineId = req.body.machineId;

    Promise.all([
      this.playerRepository.get(playerId),
      this.machineRepository.get(machineId)
    ])
      .then(([player, machine]) => {
        return new BuyCreditEvent(cardId, player, machine)
      })
      .then(transaction => this.transactionService.addTransaction(transaction))
      .then(events => res.send(events))
      .catch(err => res.status(400).send({error: err.message}));
  }
};