const express = require("express");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password, username, avatar } = req.body;
  try {
    const emailExists = await UserModel.findOne({ email: email });
    if (emailExists) {
      return res.status(400).send({ msg: "Email already exists" });
    }

    bcrypt.hash(password, 4, async (err, hash) => {
      const payload = {
        email,
        password: hash,
        username,
        avatar,
      };

      const user = new UserModel(payload);
      await user.save();

      res.status(200).send({ msg: "user successfully registered" });
    });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Sucessfully logged in",
            token: jwt.sign({ username: user.username }, "masai"),
            userID: user._id,
          });
        } else {
          res.status(400).send({ msg: "Wrong Password" });
        }
      });
    } else {
      res.status(400).send({ msg: "User not found! Please register first" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

userRouter.patch("/users/:id/reset", async (req, res) => {
  const { id } = req.params;
  const { password, newPassword } = req.body;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }

    // to comapre the old password with new password
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          // to hash the password
          bcrypt.hash(newPassword, 4, async (err, hash) => {
            user.password = hash;
            await user.save();

            res.status(200).send({ msg: "Succesfully password changed" });
          });
        } else {
          res.status(400).send({ msg: "Incorrect Password" });
        }
      });
    }
  } catch (err) {}
});

module.exports = userRouter;
