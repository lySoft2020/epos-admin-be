const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // get the token
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      next(error);
    }
  }
  if (!token) {
    res.status(401).json({ message: "No token provided!" });
  }
};
