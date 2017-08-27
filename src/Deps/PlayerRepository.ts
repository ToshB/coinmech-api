import {Logger} from 'pino';
import {Collection, Db, ObjectID} from 'mongodb';
import {omit} from 'lodash';

export interface Player {
  _id: string;
  name: string;
  email: string;
  balance: number;
}

export interface PlayerWithCardId extends Player {
  card_id: string;
}

export default class PlayerRepository {
  private collection: Collection;

  constructor(db: Db, readonly logger: Logger) {
    this.collection = db.collection('players');
  }

  private handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  add(player: Player) {
    return this.collection
      .insertOne(player)
      .then(({ops}) => ops[0] as Player)
      .catch(this.handleError);
  }

  update(id: string, player: Player): Promise<Player> {
    return Promise.resolve()
      .then(() => {
        return this.collection
          .findOneAndUpdate(
            {_id: new ObjectID(id)},
            {$set: omit(player, '_id')},
            {returnOriginal: false}
          );
      })
      .then(({value}) => value)
      .catch(this.handleError);
  }

  remove(id: string): Promise<void> {
    return this.collection
      .deleteOne({_id: new ObjectID(id)})
      .then(() => undefined)
      .catch(this.handleError);
  }

  getAll(): Promise<Player[]> {
    return Promise.resolve()
      .then(() => {
        return this.collection.find().toArray();
      })
      .then(res => res)
      .catch(this.handleError)
  }

  get(id: number): Promise<Player> {
    return Promise.resolve()
      .then(() => {
        return this.collection.find({_id: new ObjectID(id)}).toArray();
      })
      .then(res => {
        return res[0];
      })
      .catch(this.handleError);
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
