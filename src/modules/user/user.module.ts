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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: ReferralUser.name, schema: ReferralUserSchema },
    ]),
    MongooseModule.forFeature([
      { name: RewardUser.name, schema: RewardUserSchema },
    ]),
    MongooseModule.forFeature([
      { name: AdminSetting.name, schema: AdminSettingSchema },
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
  ],
  exports: [UserRepository, UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'user/profile', method: RequestMethod.GET },
      { path: 'user/set-password', method: RequestMethod.POST },
      { path: 'user/profile-update', method: RequestMethod.POST },
      { path: 'user/logout', method: RequestMethod.POST },
      { path: 'user/change-password', method: RequestMethod.POST },
      { path: 'user/userEdit', method: RequestMethod.POST },
      { path: 'user/deactivate-user', method: RequestMethod.POST },
      // { path: 'user/signup-signing-otp', method: RequestMethod.POST },
    );
    consumer
      .apply(FileUploadMiddleware)
      .forRoutes(
        { path: 'user/profile-update', method: RequestMethod.POST },
        { path: 'user/userEdit', method: RequestMethod.POST },
      );
  }
}
