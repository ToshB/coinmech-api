"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const createMockPlayers = () => {
    return [
        { id: 1, card: '1234', name: 'Emma' },
        { id: 2, card: '1234', name: 'Torstein' }
    ];
};
class PlayerRepository {
    constructor() {
        this.players = createMockPlayers();
    }
    getAll() {
        return Promise.resolve(lodash_1.clone(this.players));
    }
}
exports.default = PlayerRepository;
//# sourceMappingURL=PlayerRepository.js.map