import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import TransactionService from '../Deps/TransactionService';
import {logAndSend} from '../ErrorHandler';
import P = require('pino');

export default class TransactionsController {
  public router: Router;
  private transactionService: TransactionService;
  private logger: P.Logger;

  constructor(deps: Deps) {
    this.router = Router();
    this.logger = deps.logger.child({});
    this.transactionService = deps.transactionService;
    this.router.get('/', this.getTransactions.bind(this));
  }

  getTransactions(_req: Request, res: Response) {
    this.transactionService.getAllTransactions()
      .then(transactions => res.send({transactions}))
      .catch(logAndSend(this.logger, res));
  }
};