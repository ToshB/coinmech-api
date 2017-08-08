import Deps from "../Deps";
import {Router, Request, Response} from "express";
import PlayerRepository from '../deps/PlayerRepository';

export default class PlayersController {
  public router: Router;
  private playerRepository: PlayerRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.playerRepository = deps.playerRepository;
    this.router.get('/', this.getPlayers.bind(this));
  }

  getPlayers(_req: Request, res: Response) {
    this.playerRepository.getAll()
      .then(players => res.send({players}));
  }
};