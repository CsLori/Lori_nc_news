exports.formatDates = list => {
  if (!list.length) return [];
  const formattedDate = list.map(obj => {
    const { created_at: value, ...restOfObj } = obj;
    return { created_at: new Date(obj.created_at), ...restOfObj };
  });
  return formattedDate;
};

exports.makeRefObj = (list, key, value) => {
  if (!list.length) return [];

  return (result = list.reduce((newRefObj, item) => {
    newRefObj[item[key]] = item[value];
    return newRefObj;
  }, {}));
};

exports.formatComments = (comments, articleRef) => {
  if (!comments.length) return [];

  return comments.map(comment => {
    const { belongs_to, created_by, created_at, ...resOfComments } = comment;
    const newObj = {
      article_id: articleRef[belongs_to],
      author: created_by,
      created_at: new Date(created_at),
      ...resOfComments
    };
    return newObj;
  });
};
