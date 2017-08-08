"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class UpdateBalanceResult {
}
exports.UpdateBalanceResult = UpdateBalanceResult;
class UpdateBalanceSuccess extends UpdateBalanceResult {
    constructor(user) {
        super();
        this.success = true;
        this.user = lodash_1.clone(user);
    }
}
class UpdateBalanceError extends UpdateBalanceResult {
    constructor(user, error) {
        super();
        this.success = false;
        this.user = lodash_1.clone(user);
        this.error = error;
    }
}
const createMockUsers = () => {
    return [
        { card: '1234', name: 'Emma', balance: 100 },
        { card: '1234', name: 'Torstein', balance: 50 }
    ];
};
class CreditsRepository {
    constructor() {
        this.users = createMockUsers();
    }
    addAmount(userId, amount) {
        return new Promise(resolve => {
            const user = this.users[userId];
            if (amount <= 0) {
                return resolve(new UpdateBalanceError(user, new Error('Unable to add negative amount')));
            }
            user.balance += amount;
            return resolve(new UpdateBalanceSuccess(user));
        });
    }
    subtractAmount(userId, amount) {
        return new Promise(resolve => {
            const user = this.users[userId];
            const currentBalance = user.balance;
            if (amount <= amount) {
                return resolve(new UpdateBalanceError(user, new Error('Unable to subtract negative amount')));
            }
            if (currentBalance < amount) {
                return resolve(new UpdateBalanceError(user, new Error('Not enough in account')));
            }
            user.balance = currentBalance - amount;
            return resolve(new UpdateBalanceSuccess(user));
        });
    }
    getUser(userId) {
        return Promise.resolve(lodash_1.clone(this.users[userId]));
    }
    getAll() {
        return Promise.resolve(lodash_1.clone(this.users));
    }
}
exports.default = CreditsRepository;
//# sourceMappingURL=CreditsRepository.js.map