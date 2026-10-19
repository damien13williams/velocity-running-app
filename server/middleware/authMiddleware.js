const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check whether a Bearer token was provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. No token provided.",
      });
    }

    // 3. Extract the token
    const token = authHeader.split(" ")[1];

    // 4. Verify the token using our JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Find the user in MongoDB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists.",
      });
    }

    // 6. Attach the authenticated user to the request
    req.user = user;

    // 7. Continue to the next middleware or controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid or expired token.",
    });
  }
};

module.exports = protect;