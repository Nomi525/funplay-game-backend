import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthMiddleware from '../../middlewares/auth.middleware';
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
    ]),

    // forwardRef(() => AllocationModule),
  ],
  controllers: [ColourBettingController],
  providers: [
    ColourBettingRepository,
    ColourBettingService,
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
