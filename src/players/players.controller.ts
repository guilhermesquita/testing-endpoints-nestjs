import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
  async getAllPlayers(
    @Query('email') email: string,
  ): Promise<Player | Player[]> {
    if (email) {
      return this.playersService.getPlayerByEmail(email);
    }

    return await this.playersService.getAllPlayers();
  }

  @Delete('/:email')
  async deletePlayer(@Param('email') email: string) {
    await this.playersService.getPlayerByEmail(email);
    return JSON.stringify({
      message: 'Player has been deleted',
    });
  }
}
