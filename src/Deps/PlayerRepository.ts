import {Logger} from 'pino';
import {Db} from 'mongodb';
import {Repository, RepositoryModel} from './Repository';

export interface Player extends RepositoryModel {
  name: string;
  email: string;
  cardId: string;
}

export default class PlayerRepository extends Repository<Player> {
  constructor(db: Db, logger: Logger) {
    super('players', db, logger);
    this.collection.createIndex({cardId: 1},{unique: true, partialFilterExpression: {cardId: {$exists: true}}});
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
