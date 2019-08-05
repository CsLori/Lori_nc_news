const { Client } = require('pg');
const dbConfig = require('./connection');
const client = new Client(dbConfig);

client.connect().then(() => {
    console.log('connected to db');
});

module.exports = client;
