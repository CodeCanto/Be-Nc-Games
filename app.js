const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesController");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ message: "Server online." });
});

app.get("/api/categories", getCategories);

module.exports = app;
