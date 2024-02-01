import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AdminSettingSchema, {
  AdminSetting,
} from '../adminSetting/entities/adminSetting.entity';
import AdminSettingRepository from '../adminSetting/repository/adminSetting.repository';
import { RewardUserController } from './controllers/rewardUser.controller';
import RewardUserSchema, { RewardUser } from './entities/rewardUser.entity';
import RewardUserRepository from './repository/rewardUser.repository';
import { RewardUserService } from './services/rewardUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardUser.name, schema: RewardUserSchema },
    ]),
    MongooseModule.forFeature([
      { name: AdminSetting.name, schema: AdminSettingSchema },
    ]),
    // forwardRef(() => AllocationModule),
  ],
  controllers: [RewardUserController],
  providers: [RewardUserRepository, AdminSettingRepository, RewardUserService],
  exports: [RewardUserRepository, RewardUserService],
})
export class RewardUserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    // consumer.apply(AuthMiddleware).forRoutes(
    //   { path: '/', method: RequestMethod.GET },
    //   // { path: 'user/signup-signin-otp', method: RequestMethod.POST },
    // );
    // consumer.apply(AuthMiddleware).forRoutes('user');
  }
}
