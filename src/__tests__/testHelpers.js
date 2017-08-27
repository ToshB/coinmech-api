import Config from '../Config';
import Server from '../Server';
import Deps from '../Deps';

const MongoInMemory = require('mongo-in-memory');
const mongodb = require('mongodb');
const hippie = require('hippie');
let initialPort = 8000;

export const verify = (done) => (err) => {
  return err ? done.fail(err) : done();
};

export const check = func => (res, body, next) => {
  let err;
  try {
    func(body);
  } catch (e) {
    err = e;
  }
  next(err);
};

const testConfig = new Config({
  port: '',
  mongoURL: 'url',
  adminUsername: 'user',
  adminPassword: 'pass',
  jwtHmacSecret: 'secret'
});

export function createTestServer() {
  let mongoInMemory = new MongoInMemory(initialPort++);

  function teardown() {
    return new Promise(resolve => {
      mongoInMemory.stop((err) => {
        if (err) {
          throw err;
        }
        resolve();
      })
    });
  }

  function initMongo() {
    return new Promise(resolve => {
      mongoInMemory.start(() => {
        const connectionString = mongoInMemory.getMongouri("testDB");
        mongodb.connect(connectionString, function (err, db) {
          resolve(db);
        });
      });
    });
  }

  return initMongo()
    .then(db => {
      const deps = new Deps(testConfig, db);
      const server = new Server(deps);
      return {
        express: server.express,
        teardown
      };
    });
}
