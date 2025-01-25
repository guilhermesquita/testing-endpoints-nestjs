import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDTO } from './dto/createPlayerDTO';
import { Player } from './interface/player.interface';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  @Post()
  async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    const { name } = createPlayerDTO;
    await this.playersService.createUpdatePlayer(createPlayerDTO);
    return JSON.stringify({
      message: `Player with ${name} has been created or edited`,
    });
  }

  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }
}
