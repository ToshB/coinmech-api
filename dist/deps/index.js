"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreditsRepository_1 = require("./CreditsRepository");
const PlayerRepository_1 = require("./PlayerRepository");
const FacebookEventLoader_1 = require("./FacebookEventLoader");
class Deps {
    constructor(config) {
        this.config = config;
        this.creditsRepository = new CreditsRepository_1.default();
        this.playerRepository = new PlayerRepository_1.default();
        this.facebookEventLoader = new FacebookEventLoader_1.default(config);
    }
}
exports.default = Deps;
//# sourceMappingURL=index.js.map