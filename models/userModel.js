const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxlength: [30, "Name cannot exceed 30 characters"],
    minlength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: [true, "Email Already Exists"],
    validate: [validator.isEmail, "Please Enter A Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  aadhaar: {
    type: Number,
    required: [true, "Please Enter Your Aadhaar Number"],
    default: 111111111111,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please Enter Your Phone Number"],

    default: "+919999999999",
  },
  city: {
    type: String,
    default: "Vrindavan",
    required: [true, "Please Enter Your City"],
  },
  state: {
    type: String,
    default: "UP",
    required: [true, "Please Enter Your State"],
  },
  // country:{
  //   type: String,
  //   default: "India"
  // },
  // countryCode:{
  //   type: String,
  //   default: "+91"
  // },
  institute: {
    type: String,
    default: "lfps",
    required: [true, "Please Enter Name Of Your Institute"],
  },
  interests: [
    {
      type: String,
    },
  ],
  role: {
    type: String,
    required: [true, "Please Enter Your Role"],
    default: "Student",
  },
  verified: {
    type: String,
    default: "unverified",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  avatar: {
    public_id: String,
    url: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// before updating any data
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// creating jwt tokwn
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// checking password in db
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//generating reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(10).toString("hex");

  //hashing and adding to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
