import {Logger} from 'pino';
import {Collection, Db} from 'mongodb';
import {ObjectID} from 'bson';

declare module 'mongodb' {
  interface Collection {
    findAndModify(a: any, b: any, c: any, d: any): any;
  }
}

export interface Card {
  _id: string;
  cardId: string;
  last_seen: Date;
  balance: number;
  player_id: string;
}

export default class MachineRepository {
  private collection: Collection;

  constructor(db: Db, readonly logger: Logger) {
    this.collection = db.collection('cards');
    this.collection.createIndex({cardId: 1}, {unique: true});
  }

  handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  addOrUpdate(cardId: string): Promise<Card> {
    return this.collection
      .findAndModify(
        {cardId},
        [],
        {
          $set: {cardId: cardId, last_seen: new Date()},
          $setOnInsert: {balance: 0, player_id: null}
        },
        {
          new: true,
          upsert: true
        }
      )
      .then((res: any) => res.value)
      .catch(this.handleError);
  }

  getAll(): Promise<Card[]> {
    return Promise.resolve()
      .then(() => {
        return this.collection.find().toArray();
      })
      .then(res => res)
      .catch(this.handleError);
  }

  assignToPlayer(id: string, playerId?: string): Promise<Card> {
    return Promise.resolve()
      .then(() => {
        return this.collection
          .findOneAndUpdate(
            {_id: new ObjectID(id)},
            {$set: {player_id: playerId}},
            {returnOriginal: false}
          );
      })
      .then(({value}) => value)
      .catch(this.handleError);
  }
}
