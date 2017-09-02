// import {Pool} from 'pg';
import {EventEmitter2} from 'EventEmitter2';
import PlayerRepository from './Deps/PlayerRepository';
import CardRepository from './Deps/CardRepository';
import MachineRepository from './Deps/MachineRepository';
// import CreditsRepository from './Deps/CreditsRepository';
import TransactionService from './Deps/TransactionService';

import Config from './Config';
import pino = require('pino');

import {Db} from 'mongodb';

export default class Deps {
  // creditsRepository: CreditsRepository;
  playerRepository: PlayerRepository;
  cardRepository: CardRepository;
  machineRepository: MachineRepository;
  transactionService: TransactionService;
  bus: EventEmitter2;

  config: Config;
  logger: pino.Logger;

  constructor(config: Config, readonly db: Db) {
    this.bus = new EventEmitter2({
      wildcard: true
    });
    this.logger = pino({name: 'coinmech'});
    this.config = config;
    this.playerRepository = new PlayerRepository(db, this.logger);
    this.cardRepository = new CardRepository(db, this.logger);
    this.machineRepository = new MachineRepository(db, this.logger);
    this.transactionService = new TransactionService(config, this.bus, this.logger);
    // this.creditsRepository = new CreditsRepository();
    // this.transactionRepository = new TransactionRepository(this.db, this.logger);


  }
}