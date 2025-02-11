import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge';
import { Challenge } from './interface/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenges.status-validation.pipes';
import { UpdateChallengeDTO } from './dtos/update-challenge';
import { AssignChallengeMatchDTO } from './dtos/assign-challenge-match.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    return await this.challengesService.createChallenge(createChallengeDTO);
  }

  @Get()
  async getChallenges(
    @Query('idPlayer') _id: string,
  ): Promise<Array<Challenge>> {
    return _id
      ? await this.challengesService.getChallengesFromAPlayer(_id)
      : await this.challengesService.getAllChallenges();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe)
    updateChallengeDto: UpdateChallengeDTO,
    @Param('challenge') _id: string,
  ): Promise<void> {
    await this.challengesService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/match/')
  async assignChallengePartida(
    @Body(ValidationPipe)
    assignChallengePartidaDto: AssignChallengeMatchDTO,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.AssignChallengeMatch(
      _id,
      assignChallengePartidaDto,
    );
  }

  @Delete('/:_id')
  async deletEChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.deleteChallenge(_id);
  }
}
