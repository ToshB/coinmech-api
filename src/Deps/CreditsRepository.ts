// import {clone} from 'lodash';
//
// export interface User {
//   card: string;
//   name: string;
//   balance: number;
// }
//
// export abstract class UpdateBalanceResult {
//   success: boolean;
//   user: User;
// }
//
// class UpdateBalanceSuccess extends UpdateBalanceResult {
//   constructor(user: User) {
//     super();
//     this.success = true;
//     this.user = clone(user);
//   }
// }
//
// class UpdateBalanceError extends UpdateBalanceResult {
//   error: Error;
//
//   constructor(user: User, error: Error) {
//     super();
//     this.success = false;
//     this.user = clone(user);
//     this.error = error;
//   }
// }
//
// const createMockUsers = () => {
//   return [
//     {card: '1234', name: 'Emma', balance: 100},
//     {card: '1234', name: 'Torstein', balance: 50}
//   ];
// };
//
// export default class CreditsRepository {
//   private users: User[];
//
//   constructor() {
//     this.users = createMockUsers();
//   }
//
//   addAmount(userId: number, amount: number): Promise<UpdateBalanceResult> {
//     return new Promise(resolve => {
//       const user = this.users[userId];
//       if (amount <= 0) {
//         return resolve(new UpdateBalanceError(user, new Error('Unable to add negative amount')))
//       }
//
//       user.balance += amount;
//       return resolve(new UpdateBalanceSuccess(user));
//     });
//   }
//
//   subtractAmount(userId: number, amount: number): Promise<UpdateBalanceResult> {
//     return new Promise(resolve => {
//
//
//       const user = this.users[userId];
//       const currentBalance = user.balance;
//       if (amount <= amount) {
//         return resolve(new UpdateBalanceError(user, new Error('Unable to subtract negative amount')));
//       }
//       if (currentBalance < amount) {
//         return resolve(new UpdateBalanceError(user, new Error('Not enough in account')));
//       }
//
//       user.balance = currentBalance - amount;
//       return resolve(new UpdateBalanceSuccess(user));
//     });
//   }
//
//   getUser(userId: number) {
//     return Promise.resolve(clone(this.users[userId]));
//   }
//
//   getAll() {
//     return Promise.resolve(clone(this.users));
//   }
// }
