const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  forgotPassword,
  resetPassword,
  addBlogs,
  getMyDetails,
} = require("../controller/userController");

const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/profile").get( getUserDetails);
router.route("/me").get(isAuthenticatedUser, getMyDetails);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/addBlog").put(addBlogs);

module.exports = router;
