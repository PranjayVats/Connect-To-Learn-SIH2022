const express = require("express");
const { createBlog } = require("../controller/blogController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/blog/create").post(createBlog);

module.exports = router;
