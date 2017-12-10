import Config from './Config';
import Server from './Server';
import Deps from './Deps';
import 'reflect-metadata';

const config = Config.fromEnv();
const deps = new Deps(config);
deps.initialize()
  .then(deps => {
    new Server(deps).start()
  });