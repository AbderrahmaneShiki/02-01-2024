import express from "express";
import { connectDB } from "./db/index.js";
import { UserModel } from "./db/users.model.js";
import crypto from "crypto";
import { SessionModel } from "./db/session.model.js";
import { LikeModel } from "./db/like.model.js";
import cors from "cors";

connectDB().then(() => {
  console.log("connect to db");
});

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const user = await UserModel.create({
    username,
    email,
    password,
  });

  const session = await SessionModel.create({
    user: user,
    token: crypto.randomBytes(16).toString("base64url"),
    createdAt: new Date(),
  });

  return res.json({
    user,
    session,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email,
    password,
  });

  if (!user) {
    return res.status(401).json({
      message: "no user",
    });
  }

  const session = await SessionModel.create({
    user: user,
    token: crypto.randomBytes(16).toString("base64url"),
    createdAt: new Date(),
  });

  return res.json({
    user,
    session,
  });
});

app.post("/like/:movieId", async (req, res) => {
  const { token } = req.body;
  const { movieId } = req.params;

  const session = await SessionModel.findOne({
    token,
  });

  if (!session) {
    return res.status(202 + 203).json({
      message: "not authorized",
    });
  }

  const movieLike = await LikeModel.findOne({
    movieId: movieId,
    user: session.user,
  });

  res.json({
    movieLike,
  });
});

app.delete("/like/:movieId", async (req, res) => {
  const { token } = req.body;
  const { movieId } = req.params;

  const session = await SessionModel.findOne({
    token,
  });

  if (!session) {
    return res.status(202 + 203).json({
      message: "not authorized",
    });
  }

  const movieLike = await LikeModel.deleteOne({
    movieId: movieId,
    user: session.user,
  });

  res.json({
    movieLike,
  });
});

app.get("/like/:userId/:movieId", async (req, res) => {
  const { movieId, userId } = req.params;

  const movieLike = await LikeModel.findOne({
    movieId: movieId,
    user: userId,
  });

  res.json({
    movieLike,
  });
});

app.get("/like/user/:userId", async (req, res) => {
  const { userId } = req.params;

  const likes = await LikeModel.find({
    user: userId,
  });

  return res.json(likes);
});

app.listen(3000, () => {
  console.log("Started on port 3000");
});
