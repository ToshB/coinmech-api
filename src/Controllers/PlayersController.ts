import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import PlayerRepository from '../Deps/PlayerRepository';
import P = require('pino');
import {logAndSend} from '../ErrorHandler';

export default class PlayersController {
  private logger: P.Logger;
  public router: Router;
  private playerRepository: PlayerRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.logger = deps.logger.child({});
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
      .catch(logAndSend(this.logger, res));
  }

  getPlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    this.playerRepository.get(playerId)
      .then(player => res.send(player))
      .catch(logAndSend(this.logger, res));
  }

  addPlayer(req: Request, res: Response) {
    const player = req.body;
    this.playerRepository.add(player)
      .then(player => res.status(201).send(player))
      .catch(logAndSend(this.logger, res));
  }

  deletePlayer(req: Request, res:Response) {
    const playerId = req.params.id;
    this.playerRepository.remove(playerId)
      .then(() => res.send())
      .catch(logAndSend(this.logger, res));
  }

  updatePlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    const player = req.body;
    this.playerRepository.update(playerId, player)
      .then(player => res.send(player))
      .catch(logAndSend(this.logger, res));
  }
};