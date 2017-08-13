import {verify, createTestServer, getDefaultDeps} from './testHelpers';
import sinon = require('sinon');
import Hippie from 'hippie';

describe('PlayersApi', () => {
  let deps: any, server: Hippie;
  beforeEach(() => {
    deps = getDefaultDeps();
    deps.playerRepository = {
      getAll: sinon.stub().resolves([]),
    };
    server = createTestServer(deps);
  });


  it('responds', done => {
    return server
      .get('/players')
      .expectStatus(200)
      .end(verify(done));
  });

  it('returns list of players', done => {
    const player = {id: 1, name: 'Torstein'};
    deps.playerRepository.getAll.resolves([player]);

    return server
      .get('/players')
      .expectBody({players: [player]})
      .end(verify(done));
  });
});