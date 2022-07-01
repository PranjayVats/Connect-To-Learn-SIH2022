const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    req.user = await User.findById(decoded.id);
    // console.log(req.user.id);

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


