// import Deps from '../Deps';
// import {Router, Request, Response} from 'express';
// import TransactionRepository from '../Deps/TransactionRepository';
//
// export default class TransactionsController {
//   public router: Router;
//   private transactionRepository: TransactionRepository;
//
//   constructor(deps: Deps) {
//     this.router = Router();
//     this.transactionRepository = deps.transactionRepository;
//     this.router.get('/', this.getTransactions.bind(this));
//   }
//
//   getTransactions(_req: Request, res: Response) {
//     this.transactionRepository.getAll()
//       .then(transactions => res.send({transactions}))
//       .catch(e => res.status(500).send(e.message));
//   }
// };