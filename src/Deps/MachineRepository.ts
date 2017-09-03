import {Logger} from 'pino';
import {Db} from 'mongodb';
import {Repository, RepositoryModel} from './Repository';
import {assign} from 'lodash';

export interface Machine extends RepositoryModel {
  name: string;
  price: number;
  deviceId?: string;
}

export default class MachineRepository extends Repository<Machine> {
  constructor(db: Db, logger: Logger) {
    super('machines', db, logger);
    this.collection.createIndex({deviceId: 1}, {unique: true, partialFilterExpression: {deviceId: {$exists: true}}});
  }

  add(item: Machine) {
    return this.collection
      .insertOne(assign({price: 0}, item, {_id: undefined}))
      .then(({ops}) => ops[0] as Machine)
      .catch(this.handleError);
  }

  getByDeviceId(deviceId: string) {
    return this.collection.findOne({deviceId});
  }
}
