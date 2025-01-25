/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Player } from './interface/player.interface';
import { CreatePlayerDTO } from './dto/createPlayerDTO';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);
  // eslint-disable-next-line @typescript-eslint/require-await
  async createUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    this.logger.log(`createPlayerDTO: ${createPlayerDTO}`);

    this.create(createPlayerDTO);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getAllPlayers(): Promise<Player[]> {
    return this.players;
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
}
