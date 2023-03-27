const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesController");
const db = require("./db/connection");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ message: "Server online." });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", (req, res) => {
  const reviewId = req.params.review_id;
  return db.query(
    `SELECT * FROM reviews WHERE review_id = ${reviewId}`,
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send({ reviewObj: results.rows[0] });
    }
  );
});

module.exports = app;
