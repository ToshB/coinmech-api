import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import MachineRepository from '../Deps/MachineRepository';
import P = require('pino');
import {logAndSend} from '../ErrorHandler';

export default class MachinesController {
  public router: Router;
  private machineRepository: MachineRepository;
  private logger: P.Logger;

  constructor(deps: Deps) {
    this.router = Router();
    this.logger = deps.logger.child({});
    this.machineRepository = deps.machineRepository;
    this.router.get('/', this.getMachines.bind(this));
    this.router.post('/', this.addMachine.bind(this));
    this.router.get('/:id', this.getMachine.bind(this));
    this.router.put('/:id', this.updateMachine.bind(this));
    this.router.delete('/:id', this.deleteMachine.bind(this));
  }

  getMachines(_req: Request, res: Response) {
    this.machineRepository.getAll()
      .then(machines => res.send({machines}))
      .catch(logAndSend(this.logger, res));
  }

  getMachine(req: Request, res: Response) {
    const playerId = req.params.id;
    this.machineRepository.get(playerId)
      .then(machine => res.send(machine))
      .catch(logAndSend(this.logger, res));
  }

  addMachine(req: Request, res: Response) {
    const machine = req.body;
    this.machineRepository.add(machine)
      .then(machine => res.status(201).send(machine))
      .catch(logAndSend(this.logger, res));
  }

  updateMachine(req: Request, res: Response) {
    const machineId = req.params.id;
    const machine = req.body;
    this.machineRepository.update(machineId, machine)
      .then(machine => res.send(machine))
      .catch(logAndSend(this.logger, res));
  }

  deleteMachine(req: Request, res: Response) {
    const machineId = req.params.id;
    this.machineRepository.remove(machineId)
      .then(() => res.status(204).send())
      .catch(logAndSend(this.logger, res));
  }
};