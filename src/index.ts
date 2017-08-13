import Config from './Config';
import Server from './Server';
import Deps from './Deps';
const config = Config.fromEnv();
const deps = new Deps(config);

new Server(deps).start();