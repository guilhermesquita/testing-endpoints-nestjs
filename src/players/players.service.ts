import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Player } from './interface/player.interface';
import { CreatePlayerDTO } from './dto/createPlayerDTO';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDTO } from './dto/editPlayerDTO';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const playerFinded = await this.playerModel.findOne({ email }).exec();

    if (playerFinded) {
      throw new BadRequestException('Player already exists');
    }

    const player = new this.playerModel(createPlayerDTO);
    return await player.save();
  }

  async updatePlayer(
    updatePlayerDTO: UpdatePlayerDTO,
    _id: string,
  ): Promise<void> {
    const playerFinded = await this.playerModel.findOne({ _id }).exec();

    if (!playerFinded) {
      throw new BadRequestException('Player not exists');
    }

    await this.playerModel
      .findOneAndUpdate(
        { _id },
        {
          $set: updatePlayerDTO,
        },
      )
      .exec();
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(_id: string): Promise<Player> {
    const playerFinded = await this.playerModel.findOne({ _id }).exec();
    if (!playerFinded) {
      throw new NotFoundException(`Player with _id '${_id}' not found`);
    }
    return playerFinded;
  }

  async deletePlayerByEmail(_id: string): Promise<any> {
    const playerFinded = await this.playerModel.findOne({ _id }).exec();
    if (!playerFinded) {
      throw new NotFoundException(`Player with _id '${_id}' not found`);
    }
    await this.playerModel.deleteOne({ _id }).exec();
  }
}
