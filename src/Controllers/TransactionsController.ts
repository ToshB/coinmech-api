import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import TransactionService from '../Deps/TransactionService';
import {logAndSend} from '../ErrorHandler';
import pino = require('pino');
import CardRepository from '../Deps/CardRepository';

export default class TransactionsController {
  public router: Router;
  private transactionService: TransactionService;
  private cardRepository: CardRepository;
  private logger: pino.Logger;

  constructor(deps: Deps) {
    this.router = Router();
    this.logger = deps.logger.child({});
    this.cardRepository = deps.cardRepository;
    this.transactionService = deps.transactionService;
    this.router.get('/', this.getTransactions.bind(this));
    this.router.get('/rebuild', this.rebuildCards.bind(this));
  }

  getTransactions(_req: Request, res: Response) {
    this.transactionService.getAllTransactions()
      .then(transactions => res.send({transactions}))
      .catch(logAndSend(this.logger, res));
  }

  rebuildCards(_req: Request, res: Response) {
    this.cardRepository.deleteAll()
      .then(() => this.transactionService.replayAllEvents())
      .then(count => res.send(`${count} transaction(s) replayed`));
  }
};