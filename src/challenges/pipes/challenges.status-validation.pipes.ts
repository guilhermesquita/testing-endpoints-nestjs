/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatusENUM } from '../interface/challenge.status';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly statusPermitidos = [
    ChallengeStatusENUM.ACCEPTED,
    ChallengeStatusENUM.REJECTED,
    ChallengeStatusENUM.CANCELLED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} its a invalid status`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const idx = this.statusPermitidos.indexOf(status);
    return idx !== -1;
  }
}
