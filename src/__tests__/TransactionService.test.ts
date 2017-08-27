import {verify, createTestServer, getDefaultDeps, TestDatabase} from './testHelpers';
import Hippie from 'hippie';
import {Machine} from '../Deps/MachineRepository';
import createEventStore, {Eventstore} from 'eventstore';


class TransactionService {
  private es: Eventstore;
  constructor() {

  }
}

describe('TransactionService', () => {
  let transactionService: TransactionService;
  beforeEach(() => {
    transactionService = new TransactionService();
  });


  // it('responds', done => {
  //   return server
  //     .get('/machines')
  //     .expectStatus(200)
  //     .end(verify(done));
  // });

  // it('returns list of machines', done => {
  //   const machine = {id: 1, name: 'Star Wars Pro', price: 0.00};
  //   db.add(machine);
  //
  //   return server
  //     .get('/machines')
  //     .expectBody({machines: [machine]})
  //     .end(verify(done));
  // });
  //
  // it('allows adding machine', done => {
  //   const machine = {name: 'Star Wars Pro'};
  //
  //   return server
  //     .post('/machines')
  //     .send(machine)
  //     .expectBody(machine)
  //     .end(verify(done));
  // });
  //
  // it('allows deleting machine', done => {
  //   db.add({id: 1, name: 'Star Wars Pro', price: 0.00});
  //
  //   return server
  //     .del('/machines/1')
  //     .expectStatus(200)
  //     .end(verify(done));
  // })
  //
  // it('deletes machine', done => {
  //   db.add({id: 1, name: 'Star Wars Pro', price: 0.00});
  //
  //   return server
  //     .del('/machines/1')
  //     .expectStatus(200)
  //     .end(() => {
  //       server
  //         .get('/machines')
  //         .expectBody({machines: []})
  //         .end(verify(done));
  //     })
  // })
});