"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class PlayersController {
    constructor(deps) {
        this.router = express_1.Router();
        this.playerRepository = deps.playerRepository;
        this.router.get('/', this.getPlayers.bind(this));
    }
    getPlayers(_req, res) {
        this.playerRepository.getAll()
            .then(players => res.send({ players }));
    }
}
exports.default = PlayersController;
;
//# sourceMappingURL=PlayersController.js.map