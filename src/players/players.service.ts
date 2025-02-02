import { Injectable, NotFoundException } from '@nestjs/common';
import { Player } from './interface/player.interface';
import { CreatePlayerDTO } from './dto/createPlayerDTO';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const playerFinded = await this.playerModel.findOne({ email }).exec();

    if (playerFinded) {
      await this.update(createPlayerDTO);
    } else {
      await this.create(createPlayerDTO);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const playerFinded = await this.playerModel.findOne({ email }).exec();
    if (!playerFinded) {
      throw new NotFoundException(`Player with email '${email}' not found`);
    }
    return playerFinded;
  }

  async deletePlayerByEmail(email: string): Promise<any> {
    const playerFinded = await this.playerModel.findOne({ email }).exec();
    if (!playerFinded) {
      throw new NotFoundException(`Player with email '${email}' not found`);
    }
    await this.playerModel.deleteOne({ email }).exec();
  }

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const player = new this.playerModel(createPlayerDTO);
    return await player.save();
  }

  private async update(updatePlayerDTO: CreatePlayerDTO) {
    return await this.playerModel
      .findOneAndUpdate(
        { email: updatePlayerDTO.email },
        {
          $set: updatePlayerDTO,
        },
      )
      .exec();
  }
}
