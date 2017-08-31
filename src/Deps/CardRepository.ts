import {Logger} from 'pino';
import {Collection, Db} from 'mongodb';
import {ObjectID} from 'bson';
import {Repository, RepositoryModel} from './Repository';

declare module 'mongodb' {
  interface Collection {
    findAndModify<T>(a: any, b: any, c: any, d: any): Promise<{value: T}>;
  }
}

export interface Card extends RepositoryModel{
  cardId: string;
  lastSeen: Date;
  balance: number;
  playerId: string;
}

export default class CardRepository extends Repository<Card> {
  constructor(db: Db, logger: Logger) {
    super('cards', db, logger);
    this.collection.createIndex({cardId: 1}, {unique: true});
  }

  addOrUpdate(cardId: string): Promise<Card> {
    return this.collection
      .findAndModify<Card>(
        {cardId},
        [],
        {
          $set: {cardId: cardId, lastSeen: new Date()},
          $setOnInsert: {balance: 0, playerId: null}
        },
        {
          new: true,
          upsert: true
        }
      )
      .then(res => res.value)
      .catch(this.handleError);
  }

  assignToPlayer(id: string, playerId?: string): Promise<Card> {
    return Promise.resolve()
      .then(() => {
        return this.collection
          .findOneAndUpdate(
            {_id: new ObjectID(id)},
            {$set: {playerId: playerId}},
            {returnOriginal: false}
          );
      })
      .then(({value}) => value)
      .catch(this.handleError);
  }
}
