import {Pool} from 'pg';
import {Logger} from 'pino';

export interface Card {
  id: string;
  last_seen: Date;
  balance: number;
}

export default class MachineRepository {
  constructor(readonly db: Pool, readonly logger: Logger) {
  }

  handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  getAll() {
    return this.db.query('SELECT * FROM cards ORDER BY last_seen desc')
      .then(res => res.rows as Card[])
      .catch(this.handleError);
  }

  check(cardId: string) {
    const query = 'INSERT INTO cards(id, last_seen) ' +
      'VALUES ($1, now()) ' +
      'ON CONFLICT (id) ' +
      'DO UPDATE SET last_seen = now() ' +
      'RETURNING *';
    const values = [cardId];
    return this.db.query(query, values)
      .then(res => res.rows[0] as Card)
      .catch(this.handleError);
  }
}
