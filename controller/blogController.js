const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Blog = require("../models/blogModel");
const cloudinary = require("cloudinary");

//create blog
exports.createBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.blogImage, {
      folder: "blogs",
      height: 150,
      width: 150,
      quality: "auto",
      crop: "scale",
      dpr: "3.0",
    });
    const { owner, title, description } = req.body;
    const blogData = await Blog.create({
      owner,
      title,
      description,
      blogImage: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    user.blogs.unshift(blog._id);

    await user.save();

    const blog = await Blog.create(blogData);
    const user = await User.findById(req.user._id);
    res.status(201).json({
      success: true,
      blog,
      message: "Post created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
