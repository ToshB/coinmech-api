import Deps from '../Deps';
import {Router, Request, Response} from 'express';
import MachineRepository from '../Deps/MachineRepository';

export default class MachinesController {
  public router: Router;
  private machineRepository: MachineRepository;

  constructor(deps: Deps) {
    this.router = Router();
    this.machineRepository = deps.machineRepository;
    this.router.get('/', this.getMachines.bind(this));
    this.router.post('/', this.addMachine.bind(this));
    this.router.put('/:id', this.updateMachine.bind(this));
    this.router.delete('/:id', this.deleteMachine.bind(this));
  }

  getMachines(_req: Request, res: Response) {
    this.machineRepository.getAll()
      .then(machines => res.send({machines}))
      .catch(e => res.status(500).send(e.message));
  }

  addMachine(req: Request, res: Response) {
    const machine = req.body;
    this.machineRepository.add(machine)
      .then(machine => res.status(201).send(machine));
  }

  updateMachine(req: Request, res: Response) {
    const machineId = req.params.id;
    const machine = req.body;
    this.machineRepository.update(machineId, machine)
      .then(machine => res.send(machine));
  }

  deleteMachine(req: Request, res:Response) {
    const machineId = parseInt(req.params.id, 10);
    this.machineRepository.remove(machineId)
      .then(() => res.send());
  }
};