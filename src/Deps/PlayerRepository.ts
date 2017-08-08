import {clone} from 'lodash';

export interface Player {
  id: number;
  name: string;
  card: string;
}


const createMockPlayers = () => {
  return [
    {id: 1, card: '1234', name: 'Emma'},
    {id: 2, card: '1234', name: 'Torstein'}
  ];
};

export default class PlayerRepository{
  private players: Player[];

  constructor() {
    this.players = createMockPlayers();
  }

  getAll() {
    return Promise.resolve(clone(this.players));
  }
}
