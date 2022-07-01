const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    unique: true,
    required: [true, "Please Enter Blog Title"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Blog Description"],
  },
  blogImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
