import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import PlayerRepository from '../Deps/PlayerRepository';

export default class PlayersController {
  public router: Router;
  private playerRepository: PlayerRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.playerRepository = deps.playerRepository;
    this.router.get('/', this.getPlayers.bind(this));
    this.router.post('/', this.addPlayer.bind(this));
    this.router.get('/:id', this.getPlayer.bind(this));
    this.router.put('/:id', this.updatePlayer.bind(this));
    this.router.delete('/:id', this.deletePlayer.bind(this));
    // this.router.post('/:id/addFunds', this.addFunds.bind(this));
  }

  getPlayers(_req: Request, res: Response) {
    this.playerRepository.getAll()
      .then(players => res.send({players}))
      .catch(e => {
        console.log(e);
        res.status(500).send(e.message)
      });
  }

  getPlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    this.playerRepository.get(playerId)
      .then(player => res.send(player));
  }

  addPlayer(req: Request, res: Response) {
    const player = req.body;
    this.playerRepository.add(player)
      .then(player => res.status(201).send(player));
  }

  deletePlayer(req: Request, res:Response) {
    const playerId = req.params.id;
    this.playerRepository.remove(playerId)
      .then(() => res.send());
  }

  updatePlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    const player = req.body;
    this.playerRepository.update(playerId, player)
      .then(player => res.send(player));
  }

  // addFunds(req: Request, res: Response) {
  //   const playerId: number = req.params.id;
  //   const {amount} = req.body;
  //   this.playerRepository.get(playerId)
  //     .then(player => this.playerRepository.addFunds(player, amount))
  //     .then(player => res.send(player));
  // }
};