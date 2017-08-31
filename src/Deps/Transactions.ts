import {ObjectID} from 'bson';
import pino = require('pino');
import {Player} from './PlayerRepository';
import {Machine} from './MachineRepository';
import * as assert from 'assert';

const logger = pino({name: 'transactions'});

export enum TransactionType {
  BuyCredit = "Buy Credit",
  LoadMoney = "Load Money",
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

function assertValid(obj: object, msg: string) {
  if (!obj) {
    logger.error(msg);
    throw new Error(msg);
  }
}

export abstract class TransactionEvent {
  cardId: string;
  type: TransactionType;
  player: { id: ObjectID, name: string };
  amount: number;

  constructor(cardId: string, player: Player, amount: number) {
    if (!cardId) {
      throw new Error('cardId is required');
    }

    assertValid(player, 'valid player is required');

    this.cardId = cardId;
    this.player = {
      id: player._id,
      name: player.name
    };
    this.amount = amount;
  }
}

export class LoadMoneyEvent extends TransactionEvent {
  constructor(cardId: string, player: Player, amount: number) {
    logger.info({cardId, player, amount}, 'Load Money');
    assertPositive(amount);

    super(cardId, player, amount);
    this.type = TransactionType.LoadMoney;
  }
}


export class BuyCreditEvent extends TransactionEvent {
  machine: { id: ObjectID, name: string; };

  constructor(cardId: string, player: Player, machine: Machine) {
    logger.info({cardId, player, machine}, 'Buy Credit');
    assertValid(machine, 'valid machine is required');

    super(cardId, player, -machine.price);
    this.machine = {
      id: machine._id,
      name: machine.name
    };
    this.type = TransactionType.BuyCredit;
  }
}