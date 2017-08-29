import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import TransactionService from '../Deps/TransactionService';

export default class TransactionsController {
  public router: Router;
  private transactionService: TransactionService;

  constructor(deps: Deps) {
    this.router = Router();
    this.transactionService = deps.transactionService;
    this.router.get('/', this.getTransactions.bind(this));
  }

  getTransactions(_req: Request, res: Response) {
    this.transactionService.getAllTransactions()
      .then(transactions => res.send({transactions}))
      .catch(e => res.status(500).send(e.message));
  }
};