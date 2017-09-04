import Deps from "./Deps";
import {EventEmitter2} from 'eventemitter2';
import {BuyCreditEvent, RegisterCardEvent, TransactionEvent, TransactionType} from './Deps/Transactions';
import pino = require('pino');
import CardRepository, {Card} from './Deps/CardRepository';

export default class EventHandler {
  cardRepository: CardRepository;
  logger: pino.Logger;
  bus: EventEmitter2;

  constructor(deps: Deps) {
    this.logger = deps.logger.child({name: 'EventHandler'});
    this.bus = deps.bus;
    this.cardRepository = deps.cardRepository;
    this.bus.onAny(this.eventLogger);
    this.bus.on(TransactionType.RegisterCard, this.registerCard);
    this.bus.on(TransactionType.BuyCredit, this.updateCardBalance);
    this.bus.on(TransactionType.AddMoney, this.updateCardBalance);
  }

  eventLogger = (type: string, event: TransactionEvent) => {
    this.logger.debug(event, type);
  };

  registerCard = (event: RegisterCardEvent) => {
    const newCard: Card = {cardId: event.cardId, balance: 0, lastSeen: new Date()};
    this.cardRepository.add(newCard)
      .then(res => this.logger.info(`Card '${event.cardId} added`));
  };

  updateCardBalance = (event: BuyCreditEvent) => {
    this.cardRepository.updateBalance(event.cardId, event.amount)
      .then(res => this.logger.info(`Card '${res.cardId}' updated. New balance: ${res.balance}`));
  };
}