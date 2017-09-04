import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import CardRepository, {Card} from '../Deps/CardRepository';
import PlayerRepository, {Player} from '../Deps/PlayerRepository';
import MachineRepository from '../Deps/MachineRepository';
import TransactionService from '../Deps/TransactionService';
import pino = require('pino');
import {BuyCreditEvent, AddMoneyEvent, RegisterCardEvent} from '../Deps/Transactions';
import {logAndSend} from '../ErrorHandler';

export default class CardsController {
  private logger: pino.Logger;
  public router: Router;
  private cardRepository: CardRepository;
  private playerRepository: PlayerRepository;
  private machineRepository: MachineRepository;
  private transactionService: TransactionService;

  constructor(deps: Deps) {
    this.router = Router();
    this.logger = deps.logger.child({name: 'CardsController'});
    this.cardRepository = deps.cardRepository;
    this.playerRepository = deps.playerRepository;
    this.transactionService = deps.transactionService;
    this.machineRepository = deps.machineRepository;

    this.router.get('/', this.getCards.bind(this));
    this.router.post('/', this.scanCard.bind(this));
    this.router.get('/:id', this.getCard.bind(this));
    this.router.post('/:id/assignToPlayer', this.assignCard.bind(this));
    this.router.post('/:id/addMoney', this.addMoney.bind(this));
    // this.router.post('/:id/buyCredit', this.buyCredit.bind(this));
  }

  scanCard(req: Request, res: Response) {
    const cardId = req.body.data;
    this.logger.info(req.headers);
    const deviceId = req.header('x-deviceid');
    Promise.resolve(cardId)
      .then(cardId => {
        if (!cardId) {
          throw new Error('Missing required cardId');
        }
        return this.cardRepository.getByCardId(cardId);
      })
      .then(card => {
        if (!card) {
          return this.transactionService.addTransaction(new RegisterCardEvent(cardId))
            .then(() => ({cardId, balance: 0} as Card));
        }

        return card;
      })
      .then(card => Promise.all([
        card,
        this.playerRepository.getByCardId(cardId),
        this.machineRepository.getByDeviceId(deviceId)
      ]))
      .then(([card, player = null, machine]) => {
          if (machine) {
            if (card.balance >= machine.price) {
              return this.transactionService.addTransaction(new BuyCreditEvent(card, player, machine))
                .then(() => ({card, player, machine, success: true}));
            } else {
              return {card, player, machine, success: false};
            }
          } else {
            this.logger.warn(`No machine associated with device ${deviceId}`);
            return {card, player, machine: null, success: false};
          }
        }
      )
      .then((result) => {
        res.send(result);
      })
      .catch(e => {
        console.error(e);
        throw e;
      })
      .catch(logAndSend(this.logger, res));
  }

  getCard(req: Request, res: Response) {
    const cardId = req.params.id;
    this.cardRepository.getByCardId(cardId)
      .then(card => res.send(card))
      .catch(logAndSend(this.logger, res));
  }

  getCards(_req: Request, res: Response) {
    this.cardRepository.getAll()
      .then(cards => res.send({cards}))
      .catch(logAndSend(this.logger, res));
  }

  assignCard(req: Request, res: Response) {
    const cardId = req.params.id;
    const playerId = req.body.playerId.length ? req.body.playerId : null;

    return this.playerRepository.removeCard(cardId)
      .then(() => {
        if (playerId) {
          return this.playerRepository.update(playerId, {cardId} as Player)
        }
        return null;
      })
      .then(() => res.send({cardId, playerId}))
      .catch(logAndSend(this.logger, res));
  }

  addMoney(req: Request, res: Response) {
    const cardId = req.params.id;
    const amount = req.body.amount;

    this.cardRepository.getByCardId(cardId)
      .then(card => {
        if (!card) {
          throw new Error(`Card with id ${cardId} not found`)
        }

        return this.playerRepository.getByCardId(cardId)
          .then(player => new AddMoneyEvent(card, player, amount));
      })
      .then(transaction => this.transactionService.addTransaction(transaction))
      .then(() => this.cardRepository.getByCardId(cardId))
      .then(card => res.send(card))
      .catch(logAndSend(this.logger, res));
  }

  // buyCredit(req: Request, res: Response) {
  //   const cardId = req.params.id;
  //   const machineId = req.body.machineId;
  //
  //   return Promise.all([
  //     this.cardRepository.getByCardId(cardId),
  //     this.machineRepository.get(machineId)
  //   ])
  //     .then(([card, machine]) => {
  //       if (!card) {
  //         throw new Error(`Card with id ${cardId} not found`);
  //       }
  //
  //       if (!machine) {
  //         throw new Error(`Machine with id ${machineId} not found`);
  //       }
  //
  //       return this.playerRepository.get(card.playerId)
  //         .then(player => new BuyCreditEvent(card, player, machine));
  //     })
  //     .then(transaction => this.transactionService.addTransaction(transaction))
  //     .then(events => res.send(events))
  //     .catch(logAndSend(this.logger, res));
  // }
};