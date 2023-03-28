const db = require("../db/connection");

exports.fetchReview = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return results.rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::int AS comment_count FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY created_at DESC;
      `
    )
    .then((results) => {
      return results.rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.fetchReviewComments = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return db.query(`SELECT * FROM comments WHERE review_id = $1`, [
        reviewId,
      ]);
    })
    .then((results) => {
      let comments = results.rows;
      if (comments.length === 0) {
        return [];
      }
      return comments;
    })
    .catch((err) => {
      throw err;
    });
};
