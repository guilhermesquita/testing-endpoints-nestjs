/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsOptional } from 'class-validator';

export abstract class DTOBody {
  @IsOptional()
  readonly phoneNumber: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly name: string;
}
