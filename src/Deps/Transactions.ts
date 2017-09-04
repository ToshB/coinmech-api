import {ObjectID} from 'bson';
import pino = require('pino');
import {Player} from './PlayerRepository';
import {Machine} from './MachineRepository';
import {Card} from './CardRepository';

const logger = pino({name: 'transactions'});

export enum TransactionType {
  RegisterCard = "Register Card",
  BuyCredit = "Buy Credit",
  AddMoney = "Load Money"
}

export enum TransactionMethod {
  Manual
}

function assertObjectID(val: string | number, name: string) {
  if (ObjectID.isValid(val)) {
    return;
  }
  const msg = `${name} is not a valid ObjectID (was ${val})`;
  logger.error(msg);
  throw new Error(msg)
}

function assertPositive(amount: number) {
  if (!amount || amount < 0) {
    const msg = `Amount must be >= 0 when loading money (was ${amount})`;
    logger.error(msg);
    throw new Error(msg);
  }
}

function assertValid(obj: any, msg: string) {
  if (!obj) {
    logger.error(msg);
    throw new Error(msg);
  }
}

export abstract class CardEvent {
  cardId: string;
  type: TransactionType;

  constructor(type: TransactionType, cardId: string) {
    assertValid(cardId, 'valid card is required');
    this.cardId = cardId;
    this.type = type;
  }
}
export class RegisterCardEvent extends CardEvent {
  constructor(cardId: string) {
    super(TransactionType.RegisterCard, cardId);
  }
}

export abstract class TransactionEvent extends CardEvent {
  player?: { id: ObjectID, name: string };
  amount: number;

  constructor(type: TransactionType, card: Card, player: Player, amount: number) {
    assertValid(card, 'valid card is required');
    super(type, card.cardId);

    this.player = player ? {
      id: player._id,
      name: player.name
    } : null;
    this.amount = amount;
  }
}

export class AddMoneyEvent extends TransactionEvent {
  constructor(card: Card, player: Player, amount: number) {
    assertPositive(amount);
    super(TransactionType.AddMoney, card, player, amount);
  }
}


export class BuyCreditEvent extends TransactionEvent {
  machine: { id: ObjectID, name: string; };

  constructor(card: Card, player: Player, machine: Machine) {
    assertValid(machine, 'valid machine is required');
    super(TransactionType.BuyCredit, card, player, -machine.price);
    this.machine = {
      id: machine._id,
      name: machine.name
    };
  }
}