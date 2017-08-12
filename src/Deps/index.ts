import {Pool} from 'pg';
import {parse} from 'pg-connection-string';
import CreditsRepository from './CreditsRepository';
import PlayerRepository from './PlayerRepository';
import TransactionRepository from './TransactionRepository';
import Config from '../Config';
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
  playerRepository: PlayerRepository;
  transactionRepository: TransactionRepository;
  config: Config;
  logger: pino.Logger;

  constructor(config: Config) {
    this.logger = pino({name: 'coinmech'});
    this.database = getDatabasePool(config.databaseURL);
    this.creditsRepository = new CreditsRepository();
    this.playerRepository = new PlayerRepository(this.database, this.logger);
    this.transactionRepository = new TransactionRepository(this.database, this.logger);
    this.config = config;

  }
}