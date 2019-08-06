process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
chai.use(chaiSorted);
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

describe('/app', () => {
  beforeEach(() => {
    return connection.seed.run;
  });
  after(() => {
    return connection.destroy();
  });
  describe('/api', () => {
    it('ERROR - status 404 responds with a "Page not found" error message', () => {
      return request(app)
        .get('/api/topucs')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Not found');
        });
    });
    describe('/topics', () => {
      it('GET status 200 responds with an array of topics objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an('array');
            expect(body.topics[0]).to.be.an('object');
          });
      });
      it('GET status 200 responds with an object selected by username', () => {
        return request(app)
          .get('/api/users/icellusedkars')
          .expect(200)
          .then(({ body }) => {
            expect(body.user[0]).to.be.an('object');
            expect(body.user[0]).to.eql({
              username: 'icellusedkars',
              name: 'sam',
              avatar_url:
                'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            });
            expect(body.user[0]).to.have.keys('username', 'name', 'avatar_url');
          });
      });
    });
    describe('/articles', () => {
      it('GET status 200 responds with an article object selected by id', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2018-11-15T12:21:54.171Z',
              votes: 100
            });
          });
      });
    });
  });
});
