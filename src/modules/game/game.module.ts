import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthMiddleware from '../../middlewares/auth.middleware';
import { GameController } from './controllers/game.controller';
import GameRepository from './repository/game.repository';
import { GameService } from './services/game.service';
import GameSchema, { Game } from './entities/game.entity';
import UserSchema, { User } from '../user/entities/user.entity';
import GameRewardSchema, { GameReward } from './entities/gameReward.entity';
import GameRewardRepository from './repository/gameReward.repository';
import gameRulesSchema, { GameRules } from './entities/gameRules.entity';
import gameTimeSchema, { GameTime } from './entities/gameTIme.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: User.name, schema: UserSchema },
      { name: GameReward.name, schema: GameRewardSchema },
      { name: GameRules.name, schema: gameRulesSchema },
      { name: GameTime.name, schema: gameTimeSchema },
      // { name: NewTransaction.name, schema: NewTransactionSchema },
      // { name: User.name, schema: UserSchema },
    ]),

    // forwardRef(() => AllocationModule),
  ],
  controllers: [GameController],
  providers: [
    GameRepository,
    GameService,
    GameRewardRepository,
    // ReferralUserRepository,
    // RewardUserService,
    // RewardUserRepository,
    // AdminSettingRepository,
    // TransactionHistoryRepository,
    // CurrencyCoinRepository,
  ],
  exports: [GameRepository, GameService],
})
export class GameModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'user/profile', method: RequestMethod.GET },
        { path: 'user/set-password', method: RequestMethod.POST },
        { path: 'user/profile-update', method: RequestMethod.POST },
        { path: 'user/logout', method: RequestMethod.POST },
        { path: 'user/change-password', method: RequestMethod.POST },
        { path: 'user/userEdit', method: RequestMethod.POST },
        { path: 'user/deactivate-user', method: RequestMethod.POST },
        { path: 'user/dashboard', method: RequestMethod.GET },
      );
    // consumer
    //   .apply(FileUploadMiddleware)
    //   .forRoutes(
    //     { path: 'user/profile-update', method: RequestMethod.POST },
    //     { path: 'user/userEdit', method: RequestMethod.POST },
    //   );
  }
}
