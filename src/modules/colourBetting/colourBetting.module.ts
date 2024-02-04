import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthMiddleware from '../../middlewares/auth.middleware';
import GameSchema, { Game } from '../game/entities/game.entity';
import GameRewardSchema, {
  GameReward,
} from '../game/entities/gameReward.entity';
import GameRepository from '../game/repository/game.repository';
import CurrencySchema, {
  Currency,
} from '../transaction/entities/Currency.entity';
import NewTransactionSchema, {
  NewTransaction,
} from '../transaction/entities/transaction.entity';
import TransactionRepository from '../transaction/repository/transaction.repository';
import UserSchema, { User } from '../user/entities/user.entity';
import UserRepository from '../user/repository/user.repository';
import { ColourBettingController } from './controllers/ColourBetting.controller';
import ColourBettingSchema, {
  ColourBetting,
} from './entities/colourBetting.entity';
import ColourBettingRepository from './repository/colourBetting.repository';
import { ColourBettingService } from './services/colourBetting.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ColourBetting.name, schema: ColourBettingSchema },
      { name: NewTransaction.name, schema: NewTransactionSchema },
      { name: User.name, schema: UserSchema },
      { name: Game.name, schema: GameSchema },
      { name: GameReward.name, schema: GameRewardSchema },
      { name: Currency.name, schema: CurrencySchema },
    ]),

    // forwardRef(() => AllocationModule),
  ],
  controllers: [ColourBettingController],
  providers: [
    ColourBettingRepository,
    ColourBettingService,
    GameRepository,
    UserRepository,
    TransactionRepository,
    // ReferralUserRepository,
    // RewardUserService,
    // RewardUserRepository,
    // AdminSettingRepository,
    // TransactionHistoryRepository,
    // CurrencyCoinRepository,
  ],
  exports: [ColourBettingRepository, ColourBettingService],
})
export class ColourBettingModule implements NestModule {
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
