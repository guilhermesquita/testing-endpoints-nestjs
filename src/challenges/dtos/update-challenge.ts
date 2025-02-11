import { IsOptional } from 'class-validator';
import { ChallengeStatusENUM } from '../interface/challenge.status';

export class UpdateChallengeDTO {
  @IsOptional()
  //@IsDate()
  dateTimeChallenge: Date;

  @IsOptional()
  status: ChallengeStatusENUM;
}
