import {Pool} from 'pg';
import {parse} from 'pg-connection-string';
import CreditsRepository from './Deps/CreditsRepository';
import IPlayerRepository, {DBPlayerRepository} from './Deps/PlayerRepository';
import TransactionRepository from './Deps/TransactionRepository';
import MachineRepository from './Deps/MachineRepository';
import Config from './Config';
import pino = require('pino');

function getDatabasePool(connectionString?: string) {
  if (!connectionString) {
    throw new Error('Missing required config parameter \'databaseURL\'');
  }

  const config: any = parse(connectionString);
  return new Pool(config);
}

export default class Deps {
  database: Pool;
  creditsRepository: CreditsRepository;
  playerRepository: IPlayerRepository;
  transactionRepository: TransactionRepository;
  machineRepository: MachineRepository;
  config: Config;
  logger: pino.Logger;

  constructor(config: Config) {
    this.logger = pino({name: 'coinmech'});
    this.database = getDatabasePool(config.databaseURL);
    this.creditsRepository = new CreditsRepository();
    this.playerRepository = new DBPlayerRepository(this.database, this.logger);
    this.transactionRepository = new TransactionRepository(this.database, this.logger);
    this.machineRepository = new MachineRepository(this.database, this.logger);
    this.config = config;
  }
}