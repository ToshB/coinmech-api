import {Pool, Client} from 'pg';
import {Logger} from 'pino';

export interface Player {
  id: number;
  name: string;
  email: string;
  card_id: string;
  balance: number;
}
interface PlayerRepository {
  add(player: Player): Promise<Player>;
  update(id: number, player: Player): Promise<Player>;
  addFunds(player: Player, amount: number): Promise<Player>;
  remove(id: number): Promise<void>;
  getAll() : Promise<Player[]>;
  get(id: number): Promise<Player>;
}

export default PlayerRepository;

export class DBPlayerRepository implements PlayerRepository {
  private readonly db : Pool;
  constructor(db: Pool, readonly logger: Logger) {
    this.db = db;
  }

  private handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  add(player: Player) {
    const query = 'INSERT INTO players(name, email, card_id) VALUES($1, $2, $3)';
    const values = [player.name, player.email, player.card_id];
    return this.db.query(query, values)
      .then(res => res.rows[0] as Player)
      .catch(this.handleError);
  }

  update(id: number, player: Player) {
    const query = 'UPDATE players SET name=$2, email=$3, card_id=$4 WHERE id=$1 RETURNING *';
    const values = [id, player.name, player.email, player.card_id];
    return this.db.query(query, values)
      .then(res => res.rows[0] as Player)
      .catch(this.handleError);
  }

  addFunds(player: Player, amount: number) {
    const updateBalance = (client: Client) => {
      const query = 'UPDATE players SET balance=balance+$2 WHERE id=$1 RETURNING *';
      const values = [player.id, amount];
      return client.query(query, values)
        .then(res => res.rows[0] as Player)
        .catch(this.handleError);
    };

    const addTransaction = (client: Client) => {
      const query = 'INSERT INTO transactions(card_id, player_id, amount) VALUES($1, $2, $3)';
      const values = [player.card_id, player.id, amount];
      return client.query(query, values)
        .then(() => client)
        .catch(this.handleError);
    };

    return this.db.connect()
      .then(client => client.query('BEGIN')
        .then(() => addTransaction(client))
        .then(() => updateBalance(client))
        .then((player: Player) => {
          return client.query('COMMIT')
            .then(() => player);
        })
        .catch((e: Error) => {
          return client.query('ROLLBACK')
            .then(() => this.handleError(e))
        })
      )
      .catch(this.handleError);
  }

  remove(id: number) {
    const query = 'DELETE FROM players WHERE id=$1';
    const values = [id];
    return this.db.query(query, values)
      .then(() => Promise.resolve())
      .catch(this.handleError);
  }

  getAll() {
    return this.db.query('SELECT * FROM players ORDER BY id')
      .then(res => res.rows as Player[])
      .catch(this.handleError);
  }

  get(id: number) {
    return this.db.query('SELECT * FROM players WHERE id=$1', [id])
      .then(res => res.rows[0] as Player)
      .catch(this.handleError);
  }
}
