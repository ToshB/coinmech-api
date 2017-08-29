import {ObjectID} from 'bson';
import pino = require('pino');

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

function assertPositive(amount: number){
  if(!amount || amount < 0){
    const msg = `Amount must be >= 0 when loading money (was ${amount})`;
    logger.error(msg);
    throw new Error(msg);
  }
}

export abstract class TransactionEvent {
  cardId: string;
  type: TransactionType;
  playerId: ObjectID;
  amount: number;

  constructor(cardId: string, playerId: string, amount: number) {
    if (!cardId) {
      throw new Error('cardId is required');
    }

    assertObjectID(playerId, 'playerId');

    this.cardId = cardId;
    this.playerId = new ObjectID(playerId);
    this.amount = amount;
  }
}

export class LoadMoneyEvent extends TransactionEvent {
  constructor(cardId: string, playerId: string, amount: number) {
    logger.info({cardId, playerId, amount}, 'Load Money');
    assertPositive(amount);

    super(cardId, playerId, amount);
    this.type = TransactionType.LoadMoney;
  }
}



export class BuyCreditEvent extends TransactionEvent {
  machineId: ObjectID;

  constructor(cardId: string, playerId: string, machineId: string, amount: number) {
    logger.info({cardId, playerId, machineId, amount}, 'Buy Credit');
    assertPositive(amount);
    assertObjectID(machineId, 'machineId');

    super(cardId, playerId, -amount);
    this.machineId = new ObjectID(machineId);
    this.type = TransactionType.BuyCredit;
  }
}