import Config from './Config';
import Server from './Server';
import Deps from './Deps';
import {Db, MongoClient} from 'mongodb';

const config = Config.fromEnv();
MongoClient.connect(config.mongoURL)
  .then((db: Db) => {
    const deps = new Deps(config, db);
    new Server(deps).start()
  });
