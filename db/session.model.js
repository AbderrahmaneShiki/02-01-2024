import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  token: String,
  createdAt: Date,
});

export const SessionModel = mongoose.model("Session", sessionSchema);
