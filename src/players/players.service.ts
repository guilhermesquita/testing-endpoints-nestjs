/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Player } from './interface/player.interface';
import { CreatePlayerDTO } from './dto/createPlayerDTO';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);
  // eslint-disable-next-line @typescript-eslint/require-await
  async createUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const playerFinded = this.players.find((player) => player.email === email);

    if (playerFinded) {
      return this.update(playerFinded, createPlayerDTO);
    }

    // this.logger.log(`createPlayerDTO: ${createPlayerDTO}`);

    this.create(createPlayerDTO);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getPlayerByEmail(email: string): Promise<Player> {
    const playerFinded = this.players.find((player) => player.email === email);
    if (!playerFinded) {
      throw new NotFoundException(`Player with email '${email}' not found`);
    }
    return playerFinded;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deletePlayerByEmail(email: string): Promise<void> {
    const index = this.players.findIndex((player) => player.email === email);
    if (index === -1) {
      throw new NotFoundException(`Player with email '${email}' not found`);
    }

    this.players.splice(index, 1);
  }

  private create(createPlayerDTO: CreatePlayerDTO): void {
    const { name, phoneNumber, email } = createPlayerDTO;
    const player: Player = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      _id: uuidv4(),
      phonenumber: phoneNumber,
      email,
      name,
      ranking: 'N/A',
      rankingPosition: 1,
      urlImagePlayer: '',
    };

    this.players.push(player);
  }

  private update(player: Player, updatePlayerDTO: CreatePlayerDTO): void {
    const { name } = updatePlayerDTO;
    player.name = name;
  }
}
