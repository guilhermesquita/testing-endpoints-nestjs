/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, Match } from './interface/challenge.interface';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDTO } from './dtos/create-challenge';
import { CategoryService } from '../category/category.service';
import { ChallengeStatusENUM } from './interface/challenge.status';
import { UpdateChallengeDTO } from './dtos/update-challenge';
import { AssignChallengeMatchDTO } from './dtos/assign-challenge-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoryService,
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDTO,
  ): Promise<Challenge> {
    /*
        Verificar se os players informados estão cadastrados
        */

    const players = await this.playersService.getAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(`id ${playerDto._id} does not a player!`);
      }
    });

    const applicantIsAPlayerMatch = createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.applicant,
    );

    if (applicantIsAPlayerMatch.length == 0) {
      throw new BadRequestException(`the applicant must be a player match`);
    }

    const playerCategory = await this.categoriesService.getCategoryByPlayer(
      createChallengeDto.applicant as unknown as string,
    );

    if (!playerCategory) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }

    const challengeCreated = new this.challengeModel(createChallengeDto);
    challengeCreated.category = playerCategory.category;
    challengeCreated.dateTimeRequest = new Date();
    /*
        Quando um desafio for criado, definimos o status desafio como pendente
        */
    challengeCreated.status = ChallengeStatusENUM.PENDING;
    return await challengeCreated.save();
  }

  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('solicitante')
      .populate('players')
      .populate('partida')
      .exec();
  }

  async getChallengesFromAPlayer(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.getAllPlayers();

    const playerFilter = players.filter((player) => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`O id ${_id} não é um player!`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('solicitante')
      .populate('players')
      .populate('partida')
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDTO,
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new NotFoundException(`Challenge ${_id} não cadastrado!`);
    }

    /*
        Atualizaremos a data da resposta quando o status do desafio vier preenchido 
        */
    if (updateChallengeDto.status) {
      challengeFound.dateTimeResponse = new Date();
    }
    challengeFound.status = updateChallengeDto.status;
    challengeFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }

  async AssignChallengeMatch(
    _id: string,
    assignChallengeMatchDTO: AssignChallengeMatchDTO,
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge ${_id} não cadastrado!`);
    }

    const playerFilter = challengeFound.players.filter(
      (player) => player._id == assignChallengeMatchDTO.def,
    );

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `O player vencedor não faz parte do desafio!`,
      );
    }

    const matchCreated = new this.matchModel(assignChallengeMatchDTO);

    matchCreated.category = challengeFound.category;

    matchCreated.players = challengeFound.players;

    const resultado = await matchCreated.save();

    challengeFound.status = ChallengeStatusENUM.REALIZED;

    challengeFound.match = resultado._id as Match;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challengeFound })
        .exec();
    } catch (error) {
      await this.matchModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge ${_id} não cadastrado!`);
    }

    challengeFound.status = ChallengeStatusENUM.CANCELLED;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }
}
