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
    });
    describe('/users', () => {
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
    describe('/articles/:id', () => {
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
      it('POST status 201 responds with a comment object containing username and comment body', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            author: 'butter_bridge',
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          })
          .expect(201)
          .then(({ body }) => {
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
            expect(body.comment.author).to.equal('butter_bridge');
          });
      });
      it('ERROR - POST status 400 responds with "Not found" error message', () => {
        return request(app)
          .post('/api/articles/25/comments')
          .send({
            author: 'butter_bridge',
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Not found');
          });
      });
      it('ERROR - POST status 400 responds with "Bad request" error message', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            au: 'butter_bridge',
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Invalid user input');
          });
      });
      it('GET status 200 responds with an array of comments objects sorted_by created_at by default', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).to.be.sortedBy('created_at', {
              descending: true
            });
            expect(body.comment[0]).to.have.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at',
              'body'
            );
          });
      });
      it('GET status 200 responds with an array of comment objects ordered_by asc', () => {
        return request(app)
          .get('/api/articles/1/comments?order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).to.be.sortedBy('created_at', {
              ascending: true
            });
          });
      });
    });
    describe('/articles/queries', () => {
      it('GET status 200 responds with an array of article objects', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles[0]).to.be.an('object');
          });
      });
      it('GET status 200 responds with author, title, article_id, topic, created_at, votes properties', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            );
          });
      });
      it('GET status 200 responds with an array of artcile objects sorted_by date by default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('GET status 200 responds with an array of artcile objects sorted_by date by given query', () => {
        return request(app)
          .get('/api/articles?sort_by=topic')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('topic', {
              descending: true
            });
          });
      });
      it('ERROR - GET status 400 responds with "Bad request" error message', () => {
        return request(app)
          .get('/api/articles?sort_by=top')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Invalid user input');
          });
      });
      it('GET status 200 responds with an array of article objects ordered_by desc by default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('GET status 200 repsonds with an array of article objects ordered_by a valid custom column', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('created_at', {
              ascending: true
            });
          });
      });
      it('GET status 200 repsonds with an array of article object filtered by username', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].author).to.equal('butter_bridge');
          });
      });
      it('GET status 200 repsonds with an array of article object filtered by topic', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.equal('mitch');
          });
      });
      it('ERROR - GET 404 responds with a "Not found" error message', () => {
        return request(app)
          .get('/api/articles?author=buttere')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Not found');
          });
      });
    });

    describe('/comments', () => {
      it('PATCH status 200 responds with an object of updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({
            inc_votes: 16
          })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment[0]).to.eql({
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: 'butter_bridge',
              votes: 32,
              created_at: '2017-11-22T12:36:03.389Z'
            });
            expect(body.comment[0]).to.have.keys(
              'comment_id',
              'body',
              'article_id',
              'author',
              'votes',
              'created_at'
            );
          });
      });
      it('ERROR - PATCH - 200 responds with the original comment with its votes remaining unchanged', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ unknown_key: 16 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment[0].votes).to.equal(16);
          });
      });
      it('ERROR -PATCH - 404 responds with Not Found when given comment_id that does not exist', () => {
        return request(app)
          .patch('/api/comments/350')
          .send({ inv_votes: 16 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Comment Not found');
          });
      });
      it('DELETE stats 204 deletes choosen comment', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
      it('ERROR -DELETE - 400 returns bad request when given incorrect param endpoint', () => {
        return request(app)
          .delete('/api/comments/bananananas')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad request');
          });
      });
    });
  });
});
