process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
chai.use(chaiSorted);
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

describe('/api', () => {
  describe('/topics', () => {
    it('GET - status 200 responds with an array of topics objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200);
    });
  });
});
