import * as hippie from "hippie";

const {verify, check, createTestServer, assert} = require('./testHelpers');

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

  it('returns newly scanned card with 0 balance', done => {
    return server
      .post('/cards')
      .send({data: 'CARD-ID'})
      .expect(check(body => {
        assert.match(body.card, {cardId: 'CARD-ID', balance: 0});
        assert.match(body.player, null);
      }))
      .end(verify(done));
  });

  it('sets lastSeen when scanning', done => {
    return server
      .post('/cards')
      .send({data: 'CARD-ID'})
      .end((err) => {
        if (err) {
          return done.fail(err);
        }

        const now = new Date();
        return server
          .post('/cards')
          .send({data: 'CARD-ID'})
          .expect(check(body => {
            assert(new Date(body.card.lastSeen) < now);
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

  // it('allows assigning card to player', done => {
  //   return server
  //     .post('/cards')
  //     .send({data: 'NEW-CARD'})
  //     .end((err, res, body) => {
  //       if (err) {
  //         return done.fail(err);
  //       }
  //
  //       const _id = body.card._id;
  //       const playerId = '59a855328e8fc09e1d1039c5';
  //       return server
  //         .post(`/cards/${_id}/assignToPlayer`)
  //         .send({playerId: playerId})
  //         .expect(check(body => {
  //           assert.match(body, {_id, cardId: 'NEW-CARD', playerId});
  //         }))
  //         .end(verify(done));
  //     });
  // });

  // it('allows unassigning card', done => {
  //   return server
  //     .post('/cards')
  //     .send({data: 'NEW-CARD'})
  //     .end((err, res, body) => {
  //       const _id = body.card._id;
  //       return server
  //         .post(`/cards/${_id}/assignToPlayer`)
  //         .send({playerId: ''})
  //         .expect(check(body => {
  //           assert.match(body, {_id, cardId: 'NEW-CARD', playerId: null});
  //         }))
  //         .end(verify(done));
  //     });
  // })
});