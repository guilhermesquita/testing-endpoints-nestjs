import mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    dateTimeChallenge: { type: Date },
    status: { type: String },
    dateTimeRequest: { type: Date },
    dateTimeResponse: { type: Date },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    category: { type: String },
  },
  {
    timestamps: true,
    collection: 'Challenge',
  },
);
