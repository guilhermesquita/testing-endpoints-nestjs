import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { MongooseModule } from '@nestjs/mongoose';
import { playerSchema } from './interface/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: playerSchema }]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
