import mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema({
  category: { type: String },
  def: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  result: [{ set: { type: String } }],
});
