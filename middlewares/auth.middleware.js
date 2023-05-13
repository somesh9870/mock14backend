const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const decoded = jwt.verify(token, "masai");

    if (decoded) {
      req.body.username = decoded.username;
      next();
    } else {
      return res.status(400).send({ msg: "Invalid token" });
    }
  } else {
    return res.status(400).send({ msg: "Not authorized" });
  }
};

module.exports = auth;
