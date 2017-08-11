import {Client} from 'pg';
import Config from "../Config";

export interface Player {
  id: number;
  name: string;
  email: string;
  card_id: string;
  balance: number;
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

  add(player: Player) {
    const query = "INSERT INTO players(name, email, card_id) VALUES($1, $2, $3)";
    const values = [player.name, player.email, player.card_id];
    return new Promise((resolve, reject) => {
      this.client.query(query, values, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.rows[0] as Player);
      })
    })
  }

  update(id: number, player: Player) {
    const query = "UPDATE players SET name=$1, email=$2, card_id=$3 WHERE id=$4 RETURNING *";
    const values = [player.name, player.email, player.card_id, id];
    return new Promise((resolve, reject) => {
      this.client.query(query, values, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.rows[0] as Player);
      })
    })
  }

  addFunds(id: number, amount: number) {
    const query = "UPDATE players SET balance=balance+$1 WHERE id=$2 RETURNING *";
    const values = [amount, id];
    return new Promise((resolve, reject) => {
      this.client.query(query, values, (err, res) => {
        if (err) {
          return reject(err);
        }

        console.log(res.rows);
        return resolve(res.rows[0] as Player);
      })
    })
  }

  delete(id: number) {
    const query = "DELETE FROM players WHERE id=$1";
    const values = [id];
    return new Promise((resolve, reject) => {
      this.client.query(query, values, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.rows[0] as Player);
      })
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.client.query('SELECT * FROM players ORDER BY id', (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.rows as Player[]);
      });
    });
  }
}
