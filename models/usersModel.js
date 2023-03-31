const { query } = require("../db/connection");
const db = require("../db/connection");
const { sort } = require("../db/data/test-data/categories");
const format = require("pg-format");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((results) => {
    return results.rows;
  });
};
