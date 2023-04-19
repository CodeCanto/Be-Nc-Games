const express = require("express");
const cors = require("cors");
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
const { getUsers } = require("./controllers/usersControllers");
const {
  handleCustomError,
  handlePSQLError,
  handleInternalError,
} = require("./controllers/errorHandlerControllers");
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  const manual = require("./endpoints.json");
  res.status(200).send({ message: "Server online.", manual: manual });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/reviews/:review_id/comments", getReviewComments);

app.get("/api/users", getUsers);

app.post("/api/reviews/:review_id/comments", cors(), postComment);

app.patch("/api/reviews/:review_id", patchVote);

app.delete("/api/comments/:comment_id", removeComment);

app.use(handleCustomError);
app.use(handlePSQLError);
app.use(handleInternalError);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found." });
});

module.exports = app;
