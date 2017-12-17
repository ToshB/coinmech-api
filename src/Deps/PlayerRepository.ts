import {Logger} from 'pino';
import {Db} from 'mongodb';
import {Repository, RepositoryModel} from './Repository';

declare module 'mongodb' {
  interface Collection {
    findAndModify<T>(a: any, b: any, c: any, d: any): Promise<{ value: T }>;
  }
}

export interface Player extends RepositoryModel {
  googleId?: string;
  name: string;
  email: string;
  cardId: string;
}

export default class PlayerRepository extends Repository<Player> {
  constructor(db: Db, logger: Logger) {
    super('players', db, logger);
    this.collection.createIndex({googleId: 1, cardId: 1}, {
      unique: true,
      partialFilterExpression: {cardId: {$exists: true}}
    });
  }

  addOrUpdate(googleId: string, name: string, email: string): Promise<Player> {
    return this.collection
      .findAndModify<Player>(
        {googleId},
        [],
        {
          $set: {name, email},
          $setOnInsert: {googleId}
        },
        {
          'new': true,
          upsert: true
        }
      )
      .then((res: {value: Player}) => res.value)
      .catch(this.handleError);
  }

  getByCardId(cardId: string) {
    return this.collection.findOne({cardId});
  }

  removeCard(cardId: string) {
    return this.collection.updateOne(
      {cardId},
      {$unset: {cardId: ''}}
    )
  }
}
