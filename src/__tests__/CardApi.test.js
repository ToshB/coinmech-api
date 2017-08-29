import * as hippie from "hippie";

const {verify, check, createTestServer} = require('./testHelpers');
const {assert} = require('sinon');

describe('CardApi', () => {
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
      .get('/cards')
      .expectStatus(200)
      .end(verify(done));
  });

  it('adds newly scanned card with 0 balance', done => {
    return server
      .post('/cards')
      .send({data: 'CARD-ID'})
      .expect(check(body => {
        assert.match(body.card, {cardId: 'CARD-ID', balance: 0});
        assert.match(body.player, null);
      }))
      .end(verify(done));
  });

  it('updates existing card when scanning', done => {
    return server
      .post('/cards')
      .send({data: 'CARD-ID'})
      .end((err, res, body) => {
        const _id = body.card._id;
        const originalSeen = new Date(body.card.last_seen);
        return server
          .post('/cards')
          .send({data: 'CARD-ID'})
          .expect(check(body => {
            const newSeen = new Date(body.card.last_seen);
            assert.match(body.card, {_id, cardId: 'CARD-ID'});
            assert.match(newSeen > originalSeen, true);
          }))
          .end(verify(done));
      });
  });

  it('returns list of cards', done => {
    return server
      .get('/cards')
      .expect(check(body => {
        assert.match(body.cards[0], {cardId: 'CARD-ID', balance: 0});
      }))
      .end(verify(done));
  });

  it('allows assigning card to player', done => {
    return server
      .post('/cards')
      .send({data: 'NEW-CARD'})
      .end((err, res, body) => {
        const _id = body.card._id;
        return server
          .post(`/cards/${_id}/assignToPlayer`)
          .send({player_id: 'player-id'})
          .expect(check(body => {
            assert.match(body, {_id, cardId: 'NEW-CARD', player_id: 'player-id'});
          }))
          .end(verify(done));
      });
  });

  it('allows unassigning card', done => {
    return server
      .post('/cards')
      .send({data: 'NEW-CARD'})
      .end((err, res, body) => {
        const _id = body.card._id;
        return server
          .post(`/cards/${_id}/assignToPlayer`)
          .send({player_id: ''})
          .expect(check(body => {
            assert.match(body, {_id, cardId: 'NEW-CARD', player_id: null});
          }))
          .end(verify(done));
      });
  })
});