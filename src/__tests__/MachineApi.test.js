import * as hippie from "hippie";

const {verify, check, createTestServer} = require('./testHelpers');
const {assert} = require('sinon');

describe('MachineApi', () => {
  let teardown, express, server;

  beforeAll(done => {
    createTestServer()
      .then(res => {
        teardown = res.teardown;
        express = res.express;
        done();
      });
  });

  beforeEach(() => {
    server = hippie(express).json();
  });

  afterAll(done => {
    teardown()
      .then(() => {
        done();
      });
  });

  it('responds', done => {
    return server
      .get('/machines')
      .expectStatus(200)
      .end(verify(done));
  });

  it('allows adding machines', done => {
    return server
      .post('/machines')
      .send({name: 'Star Wars Pro'})
      .end((err, res, body) => {
        const {_id} = body;
        return server
          .get(`/machines/${_id}`)
          .expect(check(body => {
            assert.match(body, {_id, name: 'Star Wars Pro', price: 0});
          }))
          .end(verify(done));
      });
  });

  it('allows updating machines', done => {
    return server
      .post('/machines')
      .send({name: 'ToBeUpdated'})
      .end((err, res, body) => {
        const {_id} = body;
        return server
          .put(`/machines/${_id}`)
          .send({name: 'Updated'})
          .expect(check(body => {
            assert.match(body, {name: 'Updated'});
          }))
          .end(verify(done));
      });
  });

  it('allows deleting machines', done => {
    return server
      .post('/machines')
      .send({name: 'Name'})
      .end((err, res, body) => {
        const {_id} = body;
        return server
          .del(`/machines/${_id}`)
          .expectStatus(204)
          .end(verify(done));
      });
  });

  it('gets list of machines', done => {
    server
      .get('/machines')
      .expect(check(body => {
        assert.match(body.machines[0], {name: 'Star Wars Pro'});
        assert.match(body.machines[1], {name: 'Updated'});
      }))
      .end(verify(done));
  });
});