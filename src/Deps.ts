// import {Pool} from 'pg';
import {EventEmitter2} from 'eventemitter2';
import PlayerRepository from './Deps/PlayerRepository';
import CardRepository from './Deps/CardRepository';
import MachineRepository from './Deps/MachineRepository';
// import CreditsRepository from './Deps/CreditsRepository';
import TransactionService from './Deps/TransactionService';

import Config from './Config';
import pino = require('pino');

import {Db, MongoClient} from 'mongodb';
import {Connection, Repository} from 'typeorm';
import {createPostgresConnection} from './Deps/PostgresConnection';
import {User} from './entity/User';

export default class Deps {
  userRepository: Repository<User>;
  // creditsRepository: CreditsRepository;
  playerRepository: PlayerRepository;
  cardRepository: CardRepository;
  machineRepository: MachineRepository;
  transactionService: TransactionService;
  bus: EventEmitter2;

  config: Config;
  logger: pino.Logger;
  db: Db;
  pdb: Connection;

  constructor(config: Config) {
    this.bus = new EventEmitter2({
      wildcard: true
    });
    this.logger = pino({name: 'coinmech'});
    this.config = config;

    // this.creditsRepository = new CreditsRepository();
    // this.transactionRepository = new TransactionRepository(this.db, this.logger);
  }

  initialize() {
    return Promise.all([
      MongoClient.connect(this.config.mongoURL),
      createPostgresConnection(this.config.postgresURL)
    ]).then(([db, connection]) => {
      this.db = db;
      this.pdb = connection;
      this.userRepository = connection.getRepository(User);
      this.playerRepository = new PlayerRepository(db, this.logger);
      this.cardRepository = new CardRepository(db, this.logger);
      this.machineRepository = new MachineRepository(db, this.logger);
      this.transactionService = new TransactionService(this.config, this.bus, this.logger);
      return this;
    })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
}