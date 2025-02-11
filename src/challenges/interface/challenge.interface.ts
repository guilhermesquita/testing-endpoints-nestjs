import { Document } from 'mongoose';
import { ChallengeStatusENUM } from './challenge.status';
import { Player } from 'src/players/interface/player.interface';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatusENUM;
  dateTimeRequest: Date;
  dateTimeResponse: Date;
  applicant: Player;
  players: Array<Player>;
  category: string;
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
