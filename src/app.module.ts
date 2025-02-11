import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoryModule } from './category/category.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    PlayersModule,
    MongooseModule.forRoot(
      'mongodb+srv://mongodb:5LHsz6aenhz5HLeh@clusternestjs.jesga.mongodb.net/smartranking?retryWrites=true&w=majority&appName=ClusterNestJs',
      {
        dbName: 'smartranking',
        autoIndex: true,
      },
    ),
    CategoryModule,
    ChallengesModule,
  ],
})
export class AppModule {}
