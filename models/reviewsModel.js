const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchReview = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return results.rows[0];
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id)::int AS comment_count FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY created_at DESC;
      `
    )
    .then((results) => {
      return results.rows;
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
      const comments = results.rows;
      if (comments.length === 0) {
        return [];
      }
      return comments;
    });
};

exports.insertComment = (username, body, reviewId) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `
      INSERT INTO comments (review_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [reviewId, username, body]
    )
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return results.rows[0];
    });
};

exports.updateVote = (reviewId, inc_votes) => {
  if (!Number.isInteger(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `
      UPDATE reviews 
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *;
      `,
      [inc_votes, reviewId]
    )
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Invalid key" });
      }

      return results.rows[0];
    });
};

exports.deleteComment = (commentId) => {
  const parsedCommentId = parseInt(commentId);

  if (isNaN(parsedCommentId) || !Number.isInteger(parsedCommentId)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *;`, [commentId])
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Invalid key" });
      }
      return results;
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((results) => {
    return results.rows;
  });
};
