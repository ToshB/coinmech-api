import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import TransactionService from '../Deps/TransactionService';
import PlayerRepository, {Player} from '../Deps/PlayerRepository';
import MachineRepository, {Machine} from '../Deps/MachineRepository';
import CardRepository, {Card} from '../Deps/CardRepository';
import {BuyCreditEvent, LoadMoneyEvent} from '../Deps/Transactions';

const r5 = () => Math.floor(5 * Math.random());

function cardId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + '-' + s4() + '-' + s4() + '-' + s4();
}

type PlayerCardPair = { player: Player, card: Card };

export default class DummyDataController {
  private playerRepository: PlayerRepository;
  private machineRepository: MachineRepository;
  public router: Router;
  private transactionService: TransactionService;
  private cardRepository: CardRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.playerRepository = deps.playerRepository;
    this.machineRepository = deps.machineRepository;
    this.cardRepository = deps.cardRepository;
    this.transactionService = deps.transactionService;
    this.router.get('/', this.generateDummyData.bind(this));
  }

  generateData() {
    return Promise.all([
      Promise.all([
        this.playerRepository.add({name: 'Parzival', email: 'parzival@coinmech.com'}),
        this.playerRepository.add({name: 'Art3mis', email: 'parzival@coinmech.com'}),
        this.playerRepository.add({name: 'Aech', email: 'parzival@coinmech.com'}),
        this.playerRepository.add({name: 'Daito', email: 'parzival@coinmech.com'}),
        this.playerRepository.add({name: 'Shoto', email: 'parzival@coinmech.com'}),
      ]),
      Promise.all([
        this.machineRepository.add({name: 'White Water', price: 5}),
        this.machineRepository.add({name: 'X-Files', price: 10}),
        this.machineRepository.add({name: 'Star Wars Pro', price: 10}),
        this.machineRepository.add({name: 'Tron Pro', price: 10}),
        this.machineRepository.add({name: 'Flintstones', price: 0}),
      ])
    ])
      .then(([players, machines]) => {
        const cardPromises = players.map(player => this.cardRepository.add({
          cardId: cardId(),
          lastSeen: new Date(),
          balance: 0,
          playerId: player._id.toString()
        }).then((card: Card) => ({player, card})));

        return Promise.all([
          machines,
          Promise.all(cardPromises)
        ]);
      })
      .then(([machines, playerCardPairs]) => ({playerCardPairs, machines}));
  }

  generateTransactions(playerCardPairs: PlayerCardPair[], machines: Machine[]) {
    return Promise.all([playerCardPairs.map(({player, card}) => {
      this.transactionService.addTransaction(new LoadMoneyEvent(card.cardId, player, 200));
    })])
      .then(() => {
        for (let i = 0; i < 20; i++) {
          const {card, player} = playerCardPairs[r5()];
          const machine = machines[r5()];
          this.transactionService.addTransaction(new BuyCreditEvent(card.cardId, player, machine));
        }
      });
  }


  generateDummyData(_req: Request, res: Response) {
    this.generateData()
      .then(data => this.generateTransactions(data.playerCardPairs, data.machines))
      .then(() => res.send({generated: 'ok'}))
      .catch(e => res.status(500).send(e.message));
  }
};
