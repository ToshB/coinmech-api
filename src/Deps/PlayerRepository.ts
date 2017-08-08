import {Client} from 'pg';
import Config from "../Config";

class DB_Player {
  id: number;
  first_name: string;
  last_name: string;
  cardId: string;
  balance: number;
}

export class Player {
  constructor(readonly id: number, readonly name: string, readonly card: string) {
  }

  static fromDB(p: DB_Player) {
    const name = `${p.first_name} ${p.last_name}`;
    return new Player(p.id, name, p.cardId);
  }
}

export default class PlayerRepository {
  private client: Client;

  constructor(config: Config) {
    if (!config.databaseURL) {
      throw new Error('Missing required config parameter \'databaseURL\'');
    }

    this.client = new Client(config.databaseURL);
    this.client.connect();
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.client.query('SELECT * FROM players', (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.rows.map(Player.fromDB));
      });
    });
  }
}
