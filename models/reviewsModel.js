const { query } = require("../db/connection");
const db = require("../db/connection");
const { sort } = require("../db/data/test-data/categories");
const format = require("pg-format");

exports.fetchReview = (reviewId) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::int AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1 
    GROUP BY reviews.review_id;`,
      [reviewId]
    )
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return results.rows[0];
    });
};

async function getValidSorts() {
  const result = await db.query(
    `SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'reviews'
    `
  );
  const { rows } = result;
  return rows.map((row) => row.column_name);
}

async function getValidCategories() {
  const result = await db.query(`SELECT slug FROM categories`);
  const { rows } = result;
  return rows.map((row) => row.slug);
}

exports.fetchReviews = async (query) => {
  const validSorts = await getValidSorts();
  const validCategories = await getValidCategories();

  const options = {
    sort_by: validSorts,
    order: ["ASC", "DESC"],
    category: validCategories,
  };

  const { category, sort_by = "created_at", order = "DESC" } = query;

  const queryMethod = Object.keys(query).find((key) => key !== undefined);
  const queryValue = Object.values(query).find((value) => value !== undefined);

  if (queryMethod === undefined && queryValue === undefined) {
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
  }

  const validValues = options[queryMethod];

  if (!options.category.includes(category) && category !== undefined) {
    return Promise.reject({
      status: 404,
      msg: "Sorry we can't find that category.",
    });
  }

  if (!validValues.includes(queryValue) && queryValue !== undefined) {
    return Promise.reject({
      status: 400,
      msg: `${queryValue} is not a valid ${queryMethod} value.`,
    });
  }

  let queryString = "SELECT * FROM reviews";

  if (category) {
    queryString += format(` WHERE category=%L`, category);
  }

  if (sort_by) {
    queryString += ` ORDER BY ${sort_by}`;
  }

  if (order) {
    queryString += ` ${order}`;
  }

  return db.query(queryString).then((results) => {
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
  console.log(username, body, reviewId);
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
