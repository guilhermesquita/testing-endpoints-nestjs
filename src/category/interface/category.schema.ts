import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema(
  {
    category: { type: String, unique: true },
    description: { type: String },
    events: [{ name: String, operation: String, value: Number }],
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  },
  { timestamps: true, collection: 'Category' },
);
