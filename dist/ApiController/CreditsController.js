"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class CreditsController {
    constructor(deps) {
        this.router = express_1.Router();
        this.creditsRepository = deps.creditsRepository;
        this.router.get('/', this.getCredits.bind(this));
        this.router.post('/', this.updateCredits.bind(this));
    }
    getCredits(req, res) {
        const userId = parseInt(req.query.userId, 10);
        this.creditsRepository.getUser(userId)
            .then(user => res.send(user));
    }
    updateCredits(req, res) {
        const userId = parseInt(req.body.data, 10);
        this.creditsRepository.subtractAmount(userId, 10)
            .then(result => res.send(result));
        return;
    }
}
exports.default = CreditsController;
;
//# sourceMappingURL=CreditsController.js.map