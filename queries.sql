\c nc_news_test


SELECT comment_id, comments.votes, comments.created_at, comments.author AS username, comments.body 
FROM articles
LEFT JOIN comments on articles.article_id = comments.article_id;