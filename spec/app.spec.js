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
    return connection.seed.run();
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
      it('ERROR - status 404 responds with a message "Not found"', () => {
        return request(app)
          .get('/api/users/icellusedkars05')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Not found');
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
              votes: 100,
              comment_count: '13'
            });
          });
      });
      it('ERROR - GET status 404 responds with "Not found" message', () => {
        return request(app)
          .get('/api/articles/15')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Not found');
          });
      });
    });
    it('ERROR - GET status 400 responds with "Bad request" message', () => {
      return request(app)
        .get('/api/articles/bakfitty')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad request');
        });
    });
    it('PATCH status 200 responds with an article object selected by article_id', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_vote: 100 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(101);
        });
    });
    it('ERROR - PATCH status 404 responds with a "Not found" message', () => {
      return request(app)
        .patch('/api/articles/34')
        .send({ inc_vote: 100 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Not found');
        });
    });
    it('ERROR - PATCH status 400 responds with a "Bad request" message', () => {
      return request(app)
        .patch('/api/articles/badboy')
        .send({ inc_vote: 100 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('Bad request');
        });
    });
    it.only('POST status 201 responds with a comment object containing username and comment body', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          author: 'butter_bridge',
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        })
        .expect(201)
        .then(({ body }) => {
          console.log(body);
          expect(body.comment.body).to.equal(
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          );
          expect(body.comment).to.have.keys(
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at',
            'body'
          );
          expect(body.comment.author).to.equal('butter_bridge')
        });
    });
  });
});
