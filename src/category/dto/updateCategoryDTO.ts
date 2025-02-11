import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  events: Array<Event>;
}
