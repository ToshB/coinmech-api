"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const config_1 = require("./config");
const deps_1 = require("./deps");
const ApiController_1 = require("./ApiController");
class App {
    constructor() {
        this.express = express();
        this.config = new config_1.default();
        const deps = new deps_1.default(this.config);
        this.middleware();
        this.routes(deps);
    }
    middleware() {
        this.express.set('view engine', 'pug');
        this.express.use(bodyParser.json());
    }
    routes(deps) {
        const apiC = new ApiController_1.default(deps);
        this.express.use('/api', apiC.router);
        // this.express.get('/', (_req: any, res: express.Response) =>
        //   res.render('index', {title: 'Login', message: 'Login'})
        // );
    }
    start() {
        this.express.listen(this.config.port, () => {
            console.log(`API running on http://localhost:${this.config.port}`);
        });
    }
}
const app = new App();
app.start();
//# sourceMappingURL=index.js.map