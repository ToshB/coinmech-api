// import {Pool} from 'pg';
// import {parse} from 'pg-connection-string';
import PlayerRepository from './Deps/PlayerRepository';
import CardRepository from './Deps/CardRepository';
import MachineRepository from './Deps/MachineRepository';
// import CreditsRepository from './Deps/CreditsRepository';
// import TransactionRepository from './Deps/TransactionRepository';


import Config from './Config';
import pino = require('pino');
import {Db} from 'mongodb';

export default class Deps {
  // creditsRepository: CreditsRepository;
  playerRepository: PlayerRepository;
  cardRepository: CardRepository;
  machineRepository: MachineRepository;
  // transactionRepository: TransactionRepository;

  config: Config;
  logger: pino.Logger;

  constructor(config: Config, readonly db: Db) {
    this.logger = pino({name: 'coinmech'});
    this.config = config;
    this.playerRepository = new PlayerRepository(db, this.logger);
    this.cardRepository = new CardRepository(db, this.logger);
    this.machineRepository = new MachineRepository(db, this.logger);
    // this.creditsRepository = new CreditsRepository();
    // this.transactionRepository = new TransactionRepository(this.db, this.logger);


  }
}