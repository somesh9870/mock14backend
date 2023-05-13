const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const userRouter = require("./routes/user.route");
const blogRouter = require("./routes/blog.route");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/user", userRouter);

app.use("/blog", blogRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to mongoDB");
  } catch (err) {
    console.log("error in connecting mongoDB");
  }

  console.log(`server listening on port ${process.env.PORT}`);
});
