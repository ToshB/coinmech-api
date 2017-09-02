import {Collection, Db} from 'mongodb';
import {Logger} from "pino";
import {ObjectID} from 'bson';
import {omit} from 'lodash';

export interface RepositoryModel {
  _id?: ObjectID;
}

export abstract class Repository<T extends RepositoryModel> {
  protected collection: Collection;

  constructor(collectionName: string, db: Db, readonly logger: Logger) {
    this.collection = db.collection(collectionName);
  }

  protected handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  add(item: T) {
    return this.collection
      .insertOne(item)
      .then(({ops}) => ops[0] as T)
      .catch(this.handleError);
  }

  update(id: string, item: T): Promise<T> {
    return Promise.resolve()
      .then(() => {
        return this.collection
          .findOneAndUpdate(
            {_id: new ObjectID(id)},
            {$set: omit(item, '_id')},
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

  get(id: string): Promise<T> {
    return Promise.resolve()
      .then(() => {
        return this.collection.find({_id: new ObjectID(id)}).toArray();
      })
      .then(res => {
        return res[0];
      })
      .catch(this.handleError);
  }

  getAll(): Promise<T[]> {
    return Promise.resolve()
      .then(() => {
        return this.collection.find().toArray();
      })
      .then(res => res)
      .catch(this.handleError)
  }
}