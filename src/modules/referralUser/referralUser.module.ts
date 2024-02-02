import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralUserController } from './controllers/referralUser.controller';
import ReferralUserSchema, {
  ReferralUser,
} from './entities/referralUser.entity';
import ReferralUserRepository from './repository/referralUser.repository';
import { ReferralUserService } from './services/referralUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReferralUser.name, schema: ReferralUserSchema },
    ]),
    // forwardRef(() => AllocationModule),
  ],
  controllers: [ReferralUserController],
  providers: [ReferralUserRepository, ReferralUserService],
  exports: [ReferralUserRepository],
})
export class ReferralUserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    // consumer.apply(AuthMiddleware).forRoutes(
    //   { path: '/', method: RequestMethod.GET },
    //   // { path: 'user/signup-signin-otp', method: RequestMethod.POST },
    // );
    // consumer.apply(AuthMiddleware).forRoutes('user');
  }
}
