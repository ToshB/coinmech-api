"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors = require("cors");
const EventsController_1 = require("./EventsController");
const CreditsController_1 = require("./CreditsController");
const PlayersController_1 = require("./PlayersController");
class ApiRouter {
    constructor(deps) {
        this.router = express_1.Router();
        this.router.use(cors());
        this.router.use('/events', new EventsController_1.default(deps).router);
        this.router.use('/credits', new CreditsController_1.default(deps).router);
        this.router.use('/players', new PlayersController_1.default(deps).router);
        this.router.get('/', (_req, res) => {
            res.send({ description: 'OPC API' });
        });
    }
}
exports.default = ApiRouter;
//# sourceMappingURL=index.js.map