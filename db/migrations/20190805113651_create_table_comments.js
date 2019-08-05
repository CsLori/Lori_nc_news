exports.up = function(knex) {
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable.integer('author').references('articles.article_id');
    commentsTable.integer('votes').defaultsTo(0);
    commentsTable.timestamp('created_at').defaultsTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};
