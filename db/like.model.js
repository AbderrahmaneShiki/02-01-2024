import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  movieId: String,
  user: mongoose.Types.ObjectId,
});

export const LikeModel = mongoose.model("Like", likeSchema);
