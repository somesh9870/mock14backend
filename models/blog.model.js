const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    username: String,
    title: String,
    content: String,
    category: String,
    date: {
      type: Date,
      default: Date.now(),
    },
    likes: Number,
    comments: [
      {
        username: String,
        content: String,
      },
    ],
  },
  {
    versionKey: false,
  }
);

const BlogModel = mongoose.model("blog", blogSchema);

module.exports = BlogModel;
