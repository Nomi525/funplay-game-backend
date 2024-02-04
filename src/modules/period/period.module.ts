import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthMiddleware from '../../middlewares/auth.middleware';
import UserSchema, { User } from '../user/entities/user.entity';
import { PeriodController } from './controllers/period.controller';
import PeriodSchema, { Period } from './entities/period.entity';
import PeriodRepository from './repository/period.repository';
import { PeriodService } from './services/period.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Period.name, schema: PeriodSchema },
      { name: User.name, schema: UserSchema },
      // { name: GameReward.name, schema: GameRewardSchema },
      // { name: NewTransaction.name, schema: NewTransactionSchema },
      // { name: User.name, schema: UserSchema },
    ]),

    // forwardRef(() => AllocationModule),
  ],
  controllers: [PeriodController],
  providers: [
    PeriodRepository,
    PeriodService,
    // GameRewardRepository,
    // ReferralUserRepository,
    // RewardUserService,
    // RewardUserRepository,
    // AdminSettingRepository,
    // TransactionHistoryRepository,
    // CurrencyCoinRepository,
  ],
  exports: [PeriodRepository, PeriodService],
})
export class PeriodModule implements NestModule {
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
