import {Logger} from 'pino';
import {Collection, Db} from 'mongodb';
import {ObjectID} from 'bson';
import {assign, omit} from 'lodash';

export interface Machine {
  _id: string;
  name: string;
  price: number;
}

export default class MachineRepository {
  private collection: Collection;

  constructor(db: Db, readonly logger: Logger) {
    this.collection = db.collection('machines');
  }

  handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  getAll() {
    return Promise.resolve()
      .then(() => {
        return this.collection.find().toArray();
      })
      .then(res => res as Machine[])
      .catch(this.handleError)
  }

  add(machine: Machine) {
    return this.collection
      .insertOne(assign({price: 0}, machine))
      .then(({ops}) => ops[0] as Machine)
      .catch(this.handleError);
  }

  get(id: number) {
    return Promise.resolve()
      .then(() => {
        return this.collection.find({_id: new ObjectID(id)}).toArray();
      })
      .then(res => {
        return res[0] as Machine;
      })
      .catch(this.handleError);
  }


  update(id: number, machine: Machine) {
    return Promise.resolve()
      .then(() => {
        return this.collection
          .findOneAndUpdate(
            {_id: new ObjectID(id)},
            {$set: omit(machine, '_id')},
            {returnOriginal: false}
          );
      })
      .then(({value}) => value as Machine)
      .catch(this.handleError);
  }

  remove(id: string): Promise<void> {
    return this.collection
      .deleteOne({_id: new ObjectID(id)})
      .then(() => undefined)
      .catch(this.handleError);
  }
}
