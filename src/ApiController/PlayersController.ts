import Deps from "../Deps";
import {Router, Request, Response} from "express";
import PlayerRepository from '../Deps/PlayerRepository';

export default class PlayersController {
  public router: Router;
  private playerRepository: PlayerRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.playerRepository = deps.playerRepository;
    this.router.get('/', this.getPlayers.bind(this));
    this.router.post('/', this.addPlayer.bind(this));
    this.router.put('/:id', this.updatePlayer.bind(this));
    this.router.delete('/:id', this.deletePlayer.bind(this));
    this.router.post('/:id/addFunds', this.addFunds.bind(this));
  }

  getPlayers(_req: Request, res: Response) {
    this.playerRepository.getAll()
      .then(players => res.send({players}));
  }

  addPlayer(req: Request, res: Response) {
    const player = req.body;
    this.playerRepository.add(player)
      .then(player => res.status(201).send(player));
  }

  deletePlayer(req: Request, res:Response) {
    const playerId = req.params.id;
    this.playerRepository.delete(playerId)
      .then(() => res.send());
  }

  updatePlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    const player = req.body;
    this.playerRepository.update(playerId, player)
      .then(player => res.send(player));
  }

  addFunds(req: Request, res: Response) {
    const playerId = req.params.id;
    const {amount} = req.body;
    this.playerRepository.addFunds(playerId, amount)
      .then(player => res.send(player));
  }
};