const db = require("../db/connection");

exports.fetchReview = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then((results) => {
      return results.rows[0];
    })
    .catch((err) => {
      throw err;
    });
};
