const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesController");
const {
  getReview,
  getReviews,
  getReviewComments,
  postComment,
  patchVote,
  removeComment,
} = require("./controllers/reviewsController");
const {
  handleCustomError,
  handlePSQLError,
  handleInternalError,
} = require("./controllers/errorHandlerControllers");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ message: "Server online." });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchVote);

app.delete("/api/comments/:comment_id", removeComment);

app.use(handleCustomError);
app.use(handlePSQLError);
app.use(handleInternalError);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found." });
});

module.exports = app;
