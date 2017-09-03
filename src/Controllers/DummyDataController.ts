import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import TransactionService from '../Deps/TransactionService';
import PlayerRepository, {Player} from '../Deps/PlayerRepository';
import MachineRepository, {Machine} from '../Deps/MachineRepository';
import CardRepository, {Card} from '../Deps/CardRepository';
import {BuyCreditEvent, LoadMoneyEvent, RegisterCardEvent} from '../Deps/Transactions';
import {Collection} from 'mongodb';

const r5 = () => Math.floor(5 * Math.random());

function cardId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + '-' + s4() + '-' + s4() + '-' + s4();
}

export default class DummyDataController {
  private playerRepository: PlayerRepository;
  private machineRepository: MachineRepository;
  public router: Router;
  private transactionService: TransactionService;
  private cardRepository: CardRepository;
  private collection: Collection;

  constructor(deps: Deps) {
    this.router = Router();
    this.collection = deps.db.collection('transactions');
    this.playerRepository = deps.playerRepository;
    this.machineRepository = deps.machineRepository;
    this.cardRepository = deps.cardRepository;
    this.transactionService = deps.transactionService;
    this.router.get('/', this.generateDummyData.bind(this));
  }

  generateData() {
    const cards = [cardId(), cardId(), cardId(), cardId(), cardId()];

    return Promise.all([
      Promise.all([
        this.playerRepository.add({name: 'Parzival', email: 'parzival@coinmech.com', cardId: cards[0]}),
        this.playerRepository.add({name: 'Art3mis', email: 'art3mis@coinmech.com', cardId: cards[1]}),
        this.playerRepository.add({name: 'Aech', email: 'aech@coinmech.com', cardId: cards[2]}),
        this.playerRepository.add({name: 'Daito', email: 'daito@coinmech.com', cardId: cards[3]}),
        this.playerRepository.add({name: 'Shoto', email: 'shoto@coinmech.com', cardId: cards[4]}),
      ]),
      Promise.all([
        this.machineRepository.add({name: 'White Water', price: 5}),
        this.machineRepository.add({name: 'X-Files', price: 10}),
        this.machineRepository.add({name: 'Star Wars Pro', price: 10}),
        this.machineRepository.add({name: 'Tron Pro', price: 10}),
        this.machineRepository.add({name: 'Flintstones', price: 0}),
      ])
    ]);
  }

  generateTransactions(players: Player[], machines: Machine[]) {
    return Promise.all(players.map(player => {
      return this.transactionService.addTransaction(new RegisterCardEvent(player.cardId));
    }))
      .then(() => Promise.all(players.map(player => {
        const card = {cardId: player.cardId} as Card;
        return this.transactionService.addTransaction(new LoadMoneyEvent(card, player, 200));
      })))
      .then(() => {
        for (let i = 0; i < 20; i++) {
          const player = players[r5()];
          const machine = machines[r5()];
          const card = {cardId: player.cardId} as Card;
          this.transactionService.addTransaction(new BuyCreditEvent(card, player, machine));
        }
      });
  }


  generateDummyData(_req: Request, res: Response) {
    this.generateData()
      .then(([players, machines]) => this.generateTransactions(players, machines))
      .then(() => res.send({generated: 'ok'}))
      .catch(e => res.status(500).send(e.message));
  }
};
