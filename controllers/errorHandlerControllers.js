exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQLError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};

exports.handleInternalError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
