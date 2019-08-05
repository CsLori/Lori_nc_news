const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('return an empty array if an empty array is passed on', () => {
    let input = [];
    expect(formatDates(input)).to.eql([]);
  });
  it('does not mutate the original array', () => {
    let input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    let actual = formatDates(input);
    expect(actual).to.not.equal([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1542284514171),
        votes: 100
      }
    ]);
  });
  it('accepts an array of object and updates the create_at property', () => {
    let input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    let actual = formatDates(input);
    expect(actual).to.eql([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1542284514171),
        votes: 100
      }
    ]);
  });
  it('accepts an array of multiple objects and updates the reate_at properties', () => {
    let input = [
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171
      },
      {
        title: 'A',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Delicious tin of cat food',
        created_at: 911564514171
      }
    ];
    let actual = formatDates(input);
    expect(actual).to.eql([
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: new Date(1037708514171)
      },
      {
        title: 'A',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Delicious tin of cat food',
        created_at: new Date(911564514171)
      }
    ]);
  });
});

describe('makeRefObj', () => {
  it('returns an empty array if an empty array is passed on', () => {
    let input = [];
    let actual = makeRefObj(input);
    expect(actual).to.eql([]);
  });
  it('does not mutate the orignal array', () => {
    let input = [
      {
        artist_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    let key = 'title';
    let value = 'artist_id';

    let actual = makeRefObj(input, key, value);
    expect(actual).to.not.equal([
      {
        artist_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
  it('returns a single object with title as a key and artist_id as a value', () => {
    let input = [
      {
        artist_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    let key = 'title';
    let value = 'artist_id';
    let actual = makeRefObj(input, key, value);
    expect(actual).to.eql({ 'Living in the shadow of a great man': 1 });
  });
  it('returns an array of objects with title as a key and artist_id as a value', () => {
    let input = [
      {
        artist_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      },
      {
        artist_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171
      },
      {
        artist_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171
      }
    ];
    let key = 'title';
    let value = 'artist_id';
    let actual = makeRefObj(input, key, value);
    expect(actual).to.eql({
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3
    });
  });
});

describe('formatComments', () => {
  it('returns an empty array if an empty array is passed on', () => {
    let input = [];
    expect(formatComments(input)).to.eql([]);
  });
  it('does not mutate the orginal array', () => {
    let input = [{
      article_id: 1,
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389
    }]
    let refObj = { 'Living in the shadow of a great man': 1 }
    let actual = formatComments(input, refObj)
    expect(actual).to.not.equal([{
      article_id: 1,
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389
    }])
  });
  it('returns an array of single object wtih its created_by property renamed to an author key and its belongs_to property renamed to an article_id', () => {
    let input = [
      {
        article_id: 1,
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      }
    ];
    let refObj = { 'Living in the shadow of a great man': 1 };
    let actual = formatComments(input, refObj);
    let expected = [
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        article_id: 1,
        author: 'butter_bridge',
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ];
    expect(actual).to.eql(expected);
  });
});
