import {Logger} from 'pino';
import {Db} from 'mongodb';
import {Repository, RepositoryModel} from './Repository';

export interface Player extends RepositoryModel {
  name: string;
  email: string;
  balance: number;
}

export default class PlayerRepository extends Repository<Player> {
  constructor(db: Db, logger: Logger) {
    super('players', db, logger);
  }

  getByCard(cardId: string) {
    return Promise.resolve({id: 1, name: 'hest', email: 'email', balance: 0});
    // return this.db.query('SELECT players.* FROM players ' +
    //   'LEFT JOIN cards ON cards.player_id = players.id' +
    //   'WHERE cards.id=$1', [cardId])
    //   .then(res => res.rows[0] as Player)
    //   .catch(this.handleError);
  }
}
