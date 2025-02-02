import mongoose from 'mongoose';

export const playerSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, require: true },
    email: { type: String, require: true },
    name: { type: String, required: true },
    ranking: String,
    rankingPosition: Number,
    urlImagePlayer: String,
  },
  { timestamps: true, collection: 'Player' },
);
