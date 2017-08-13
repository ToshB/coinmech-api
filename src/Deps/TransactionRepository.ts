import {Pool} from 'pg';
import {Logger} from 'pino';

export interface Transaction {
  id: number;
  date: number;
  card_id: string;
  player_id: string;
  amount: string;
}

export default class TransactionRepository {
  constructor(readonly db: Pool, readonly logger: Logger) {
  }

  handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  getAll() {
    return this.db.query('SELECT * FROM transactions ORDER BY id desc')
      .then(res => res.rows as Transaction[])
      .catch(this.handleError);
  }
}
