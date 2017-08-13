import DoneCallback = jest.DoneCallback;
import Config from '../Config';
import Server from '../Server';
import Deps from '../Deps';

const hippie = require('hippie');

export const verify = (done: DoneCallback) => (err: Error) => {
  return err ? done.fail(err) : done();
};

export function getDefaultDeps() {
  const config = new Config({
    port: '',
    databaseURL: 'url'
  });

  return new Deps(config);
}

export function createTestServer(deps?: Deps) {
  const server = new Server(deps || getDefaultDeps());
  return hippie(server.express).json();
}

interface IdItem {
  id: number;
}

export class TestDatabase<Item extends IdItem> {
  items: Item[];

  constructor(items?: Item[]) {
    this.items = items || [];
  }

  getAll = () => {
    return Promise.resolve(this.items);
  };

  add = (item: Item) => {
    this.items.push(item);
    return Promise.resolve(item);
  };

  remove = (id: number) => {
    const existing = this.items.find(i => i.id === id);
    if(!existing){
      return Promise.reject(new Error('Not found'));
    }
    const idx = this.items.indexOf(existing);
    this.items.splice(idx, 1);
    return Promise.resolve();
  };

  update = (id: number, item: Item) => {
    const i = this.items.find(i => i.id === id);
    Object.assign(i, item);
    return Promise.resolve(i);
  };
}