const express = require("express");
const BlogModel = require("../models/blog.model");
const auth = require("../middlewares/auth.middleware");

const blogRouter = express.Router();

blogRouter.get("/blogs", auth, async (req, res) => {
  const { title, category, sort, page, limit } = req.query;

  try {
    // for search query
    let query = {};

    if (title) {
      query.title = RegExp(title, "i");
    }

    if (category) {
      query.category = RegExp(category, "i");
    }

    // for sorting
    let sortBy = {};

    if (sort) {
      sortBy["date"] = sort === "asc" ? 1 : "desc" ? -1 : "" || 1;
    }

    // for pagination
    const pageNumber = page || 1;
    const pageLimit = limit || 5;
    const pagination = pageNumber * pageLimit - pageLimit || 0;

    const blog = await BlogModel.find(query)
      .sort(sortBy)
      .skip(pagination)
      .limit(pageLimit);

    res.status(200).send({ data: blog });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// to post a new blog
blogRouter.post("/blogs", auth, async (req, res) => {
  const payload = req.body;
  try {
    const blog = new BlogModel(payload);
    await blog.save();
    res.status(200).send({ msg: "New blog added", data: blog });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

//  to update a particular blog
blogRouter.patch("/blogs/:id", auth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const blog = await BlogModel.findByIdAndUpdate({ _id: id }, payload);
    res.status(200).send({ msg: "blog updated successfully" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

//  to delete a particular blog
blogRouter.delete("/blogs/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await BlogModel.findByIdAndDelete({ _id: id });
    res.status(200).send({ msg: "blog deleted successfully" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

//  to update a particular blog like
blogRouter.patch("/blogs/:id/like", auth, async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  try {
    const blog = await BlogModel.findByIdAndUpdate(
      { _id: id },
      { likes: likes }
    );
    res.status(200).send({ msg: "blog updated successfully" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

//  to update a particular blog comment
blogRouter.patch("/blogs/:id/comment", auth, async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    const blog = await BlogModel.findByIdAndUpdate(
      { _id: id },
      { comments: comments }
    );
    res.status(200).send({ msg: "blog updated successfully" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = blogRouter;
