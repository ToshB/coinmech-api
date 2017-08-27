import * as hippie from "hippie";

const {verify, check, createTestServer} = require('./testHelpers');
const {assert} = require('sinon');

describe('PlayerApi', () => {
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
      .get('/players')
      .expectStatus(200)
      .end(verify(done));
  });

  it('allows adding player', done => {
    return server
      .post('/players')
      .send({name: 'Torstein'})
      .end((err, res, body) => {
        const {_id} = body;
        return server
          .get(`/players/${_id}`)
          .expect(check(body => {
            assert.match(body, {_id, name: 'Torstein'});
          }))
          .end(verify(done));
      });
  });

  it('allows updating player', done => {
    return server
      .post('/players')
      .send({name: 'ToBeUpdated'})
      .end((err, res, body) => {
        const {_id} = body;
        return server
          .put(`/players/${_id}`)
          .send({name: 'Updated'})
          .expect(check(body => {
            assert.match(body, {name: 'Updated'});
          }))
          .end(verify(done));
      });
  });

  it('allows deleting player', done => {
    return server
      .post('/players')
      .send({name: 'Name'})
      .end((err, res, body) => {
        const {_id} = body;
        return server
          .del(`/players/${_id}`)
          .expectStatus(200)
          .end(verify(done));
      });
  });

  it('gets list of players', done => {
    server
      .get('/players')
      .expect(check(body => {
        assert.match(body.players[0], {name: 'Torstein'});
        assert.match(body.players[1], {name: 'Updated'});
      }))
      .end(verify(done));
  });
});