import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthMiddleware from '../../middlewares/auth.middleware';
import AdminSettingSchema, {
  AdminSetting,
} from '../adminSetting/entities/adminSetting.entity';
import AdminSettingRepository from '../adminSetting/repository/adminSetting.repository';
import ReferralUserSchema, {
  ReferralUser,
} from '../referralUser/entities/referralUser.entity';
import ReferralUserRepository from '../referralUser/repository/referralUser.repository';
import RewardUserSchema, {
  RewardUser,
} from '../rewardUser/entities/rewardUser.entity';
import RewardUserRepository from '../rewardUser/repository/rewardUser.repository';
import { RewardUserService } from '../rewardUser/services/rewardUser.service';
import { UserController } from './controllers/user.controller';
import UserSchema, { User } from './entities/user.entity';
import UserRepository from './repository/user.repository';
import { UserService } from './services/user.service';
import { FileUploadMiddleware } from 'src/middlewares/fileUpload.middleware';
import TransactionHistoryRepository from '../transaction/repository/transactionHistory.repository';
import CurrencyCoinRepository from '../transaction/repository/currencyCoin.repository';
import TransactionHistorySchema, {
  TransactionHistory,
} from '../transaction/entities/transactionHistory.entity';
import CurrencyCoinSchema, {
  CurrencyCoin,
} from '../transaction/entities/currencyCoin.entity';
import ColourBettingRepository from '../colourBetting/repository/colourBetting.repository';
import ColourBettingSchema, {
  ColourBetting,
} from '../colourBetting/entities/colourBetting.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ReferralUser.name, schema: ReferralUserSchema },
      { name: RewardUser.name, schema: RewardUserSchema },
      { name: AdminSetting.name, schema: AdminSettingSchema },
      { name: TransactionHistory.name, schema: TransactionHistorySchema },
      { name: CurrencyCoin.name, schema: CurrencyCoinSchema },
      { name: ColourBetting.name, schema: ColourBettingSchema },
    ]),

    // forwardRef(() => AllocationModule),
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
    ReferralUserRepository,
    RewardUserService,
    RewardUserRepository,
    AdminSettingRepository,
    TransactionHistoryRepository,
    CurrencyCoinRepository,
    ColourBettingRepository,
  ],
  exports: [UserRepository, UserService],
})
export class UserModule implements NestModule {
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
    consumer
      .apply(FileUploadMiddleware)
      .forRoutes(
        { path: 'user/profile-update', method: RequestMethod.POST },
        { path: 'user/userEdit', method: RequestMethod.POST },
      );
  }
}
