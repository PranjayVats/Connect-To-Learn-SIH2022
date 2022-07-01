const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//regiter a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "users",
    height: 150,
    width: 150,
    quality: "auto",
    crop: "scale",
    dpr: "3.0",
  });
  const {
    name,
    email,
    password,
    aadhaar,
    institute,
    city,
    state,
    phoneNumber,
    role,
    interests,
  } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    aadhaar,
    city,
    state,
    institute,
    role,
    interests,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  const token = await user.getJWTToken();
  //options for cookie
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(201).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
});

// user login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking for empty inputs
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Credentials", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  const isPasswordMatched = await user.checkPassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const token = await user.getJWTToken();
  //options for cookie
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
});

// get my details
exports.getMyDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(req.user);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// user details
exports.getUserDetails = catchAsyncErrors(async (req, res) => {
  try {
    const user = await User.findById(req.query.id);
    // console.log(req.query.id);
    if (user) {
      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// add blogs details
exports.addBlogs = catchAsyncErrors(async (req, res, next) => {
  const { email, blogs } = req.body;
  console.log(blogs);
  console.log(email);
  const user = await User.findOne({ email });
  if (user !== null) {
    console.log(blogs.list);
    user.blogs.count = req.body.blogs.count;
    user.blogs.list.push(req.body.blogs.list);
    console.log(user.blogs.list);
    res.status(200).json({
      success: true,
      user,
    });
  }
});

//Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //GetResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.headers.host}/password/reset/${resetToken}`;

  const resetPasswordUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
  const message = `Your password reset token is:- \n\n${resetPasswordUrl} \n\nIf you have not requested this email, then please ignore it.`;
  try {
    // console.log(resetPasswordUrl);
    await sendEmail({
      email: user.email,
      subject: `ConnectToLearn Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  let user = await User.findOne({
    resetPasswordToken,
    // resetPasswordExpire: { $gt: Date.now() },
  });
  
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired.",
        404
      )
    );
  }
  // console.log(password);
  
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Confirm Password does not match with Password", 400)
    );
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  const token = await user.getJWTToken();
  //options for cookie
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
});
