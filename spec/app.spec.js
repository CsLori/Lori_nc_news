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
    it('endpoint JSON', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
        });
    });
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
      it('ERROR - DELETE status 405 responds with "Method not allowed" error message', () => {
        return request(app)
          .delete('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
          });
      });
      it('ERROR - PATCH status 405 responds with "Method not allowed" error message', () => {
        return request(app)
          .patch('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
          });
      });
      it('ERROR - PUT status 405 responds with "Method not allowed" error message', () => {
        return request(app)
          .put('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
          });
      });
    });
    describe('/users', () => {
      it('GET status 200 responds with an object selected by username', () => {
        return request(app)
          .get('/api/users/icellusedkars')
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.be.an('object');
            expect(body.user).to.eql({
              username: 'icellusedkars',
              name: 'sam',
              avatar_url:
                'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            });
            expect(body.user).to.have.keys('username', 'name', 'avatar_url');
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
      it('ERROR - POST status 405 responds with "Method not allowed" error message', () => {
        return request(app)
          .post('/api/users/icellusedkars')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
          });
      });
    });
    describe('/articles/:id', () => {
      it('GET status 200 responds with an article object selected by id', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.article).to.eql({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              username: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2018-11-15T12:21:54.171Z',
              votes: 100,
              comment_count: '13'
            });
          });
      });
      it('ERROR - POST status 405 responds with "Method not allowed" error message', () => {
        return request(app)
          .post('/api/articles/1')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
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
          .send({ inc_vote: 1 })
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
      it('GET status 200 responds with a comment object containing username and comment body', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.eql([]);
          });
      });
      it('ERROR - POST status 422 responds with "Not found" error message', () => {
        return request(app)
          .post('/api/articles/25/comments')
          .send({
            author: 'butter_bridge',
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          })
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Unprocessable Entity');
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
          .get('/api/articles/5/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('created_at', {
              descending: true
            });
            expect(body.comments[0]).to.have.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at',
              'body'
            );
          });
      });
      it('ERROR - GET 400 responds with "Not found" error message', () => {
        return request(app)
          .get('/api/articles/bb/comments')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad request');
          });
      });
      it('GET 200 responds with an empty array when no comments found', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(0);
          });
      });
      it('ERROR - GET 404 responds with "Not found" error message', () => {
        return request(app)
          .get('/api/articles/25/comments')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Not found');
          });
      });
      it('GET status 200 responds with an array of comment objects ordered_by asc', () => {
        return request(app)
          .get('/api/articles/1/comments?order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('created_at', {
              ascending: true
            });
          });
      });
      it('GET status 200 responds with an array of comment objects with a limit of 10 as default', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(10);
          });
      });
      it('GET status 200 responds with an array of comment objects with a given limit', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(5);
          });
      });
      it('ERROR - GET status 200 repsonds with an array of comment objects', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=90')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(13);
          });
      });
      it('ERROR - GET status 200 responds with a "Bad request" error message', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=bb')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(13);
          });
      });
      it('GET status 200 responds with an array of objects request from a given page', () => {
        return request(app)
          .get('/api/articles/1/comments?p=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(3);
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
      it('ERROR - DELETE status 405 responds with "Method not allowed" error message', () => {
        return request(app)
          .delete('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
          });
      });
      it('ERROR - PATCH status 405 responds with "Method not allowed" error message', () => {
        return request(app)
          .patch('/api/articles')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
          });
      });
      it('ERROR - PUT status 405 responds with "Method not allowed" error message', () => {
        return request(app)
          .put('/api/articles')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
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
      it('POST status 201 responds with an article object', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'I am the greatest',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Die harder next time',
            created_at: new Date(1416140514171),
            votes: 377
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.article[0].article_id).to.equal(13);
            expect(body.article[0].body).to.equal('Die harder next time');
          });
      });
      it('ERROR - POST 405 responds with "Invalid user request" message when user tries to use delete, patch or put method', () => {
        const invalidMethods = ['delete', 'patch', 'put'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
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
      it('GET status 200 responds with an array of article objects up to 10 findings', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(10);
          });
      });
      it('GET status 200 responds with an array of article objects up to 5 findings', () => {
        return request(app)
          .get('/api/articles?limit=5')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(5);
          });
      });
      it.only('GET status 200 responds total count of articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { total_count } }) => {
            console.log(total_count);
            expect(total_count).to.be.equal(12);
          });
      });

      it('GET status 200 responds with an array of article objects', () => {
        return request(app)
          .get('/api/articles?p=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(2);
          });
      });
      it('ERROR - GET status 404 repsonds with a "Not found" error message', () => {
        return request(app)
          .get('/api/articles?p=5')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Not found');
          });
      });
      it('ERROR - GET status 200 responds with the first page as default', () => {
        return request(app)
          .get('/api/articles?p=bb')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(10);
          });
      });

      describe('/comments', () => {});
    });
    it('PATCH status 200 responds with an object of updated comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({
          inc_votes: 16
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.eql({
            comment_id: 1,
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: 'butter_bridge',
            votes: 32,
            created_at: '2017-11-22T12:36:03.389Z'
          });
          expect(body.comment).to.have.keys(
            'comment_id',
            'body',
            'article_id',
            'author',
            'votes',
            'created_at'
          );
        });
    });
    it('ERROR - POST status 405 responds with "Method not allowed" error message', () => {
      return request(app)
        .post('/api/comments/1')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('Method not allowed');
        });
    });
    it('ERROR - PATCH status 200 responds with the original comment with its votes remaining unchanged when adding non-existing column', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ unknown_key: 16 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(16);
        });
    });
    it('ERROR -PATCH - 404 responds with "Not Found" error message when given comment_id does not exist', () => {
      return request(app)
        .patch('/api/comments/350')
        .send({ inv_votes: 16 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Comment Not found');
        });
    });
    it('ERROR -PATCH - 200 responds with no changes in votes', () => {
      return request(app)
        .patch('/api/comments/2')
        .send({ inv_votes: 'bb' })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(14);
        });
    });
    it('DELETE stats 204 deletes choosen comment', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204);
    });
    it('ERROR - DELETE - 400 returns bad request when given incorrect comment_id', () => {
      return request(app)
        .delete('/api/comments/bananananas')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad request');
        });
    });
    it('ERROR - DELETE status 404 responds with "Bad request" error message when given id does not exist ', () => {
      return request(app)
        .delete('/api/comments/555')
        .expect(404);
    });
  });
  describe('/comments', () => {
    it('GET status 200 responds with an array of comment objects', () => {
      return request(app)
        .get('/api/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments[0]).to.be.an('object');
        });
    });
    it('GET status 200 responds with the first page with 10 findings as default', () => {
      return request(app)
        .get('/api/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(10);
        });
    });
    it('GET status 200 responds with the first page with given amount of findings', () => {
      return request(app)
        .get('/api/comments?limit=5')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(5);
        });
    });
    it('ERROR - GET status 200 repsonds with an array of comment objects', () => {
      return request(app)
        .get('/api/comments?limit=90')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(18);
        });
    });
    it('ERROR - GET status 200 responds with a "Bad request" error message', () => {
      return request(app)
        .get('/api/comments?limit=bb')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(18);
        });
    });
    it('GET status 200 responds with the second page', () => {
      return request(app)
        .get('/api/comments?p=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(8);
        });
    });
    it('ERROR - GET status 404 repsonds with a "Not found" error message', () => {
      return request(app)
        .get('/api/comments?p=5')
        .expect(404)
        .then(({ body }) => {
          console.log(body, 'test');
          expect(body.msg).to.equal('Not found');
        });
    });
    it('ERROR - GET status 200 responds with the first page as default', () => {
      return request(app)
        .get('/api/comments?p=bb')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(10);
        });
    });
  });
});
