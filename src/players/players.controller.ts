import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDTO } from './dto/createPlayerDTO';
import { Player } from './interface/player.interface';
import { PlayersParamsPipe } from './pipes/players-validator-params-pipe';
import { UpdatePlayerDTO } from './dto/editPlayerDTO';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    const { name } = createPlayerDTO;
    await this.playersService.createPlayer(createPlayerDTO);
    return JSON.stringify({
      message: `Player with ${name} has been created`,
    });
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', PlayersParamsPipe) _id: string,
  ) {
    await this.playersService.updatePlayer(updatePlayerDTO, _id);
    return JSON.stringify({
      message: `Player with ${_id} has been edited`,
    });
  }

  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayersById(
    @Param('_id', PlayersParamsPipe) _id: string,
  ): Promise<Player> {
    return this.playersService.getPlayerById(_id);
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', PlayersParamsPipe) _id: string) {
    await this.playersService.deletePlayerByEmail(_id);
    return JSON.stringify({
      message: 'Player has been deleted',
    });
  }
}
