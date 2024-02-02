import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSettingController } from './controllers/adminSetting.controller';
import AdminSettingSchema, {
  AdminSetting,
} from './entities/adminSetting.entity';
import AdminSettingRepository from './repository/adminSetting.repository';
import { AdminSettingService } from './services/adminSetting.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminSetting.name, schema: AdminSettingSchema },
    ]),
    // forwardRef(() => AllocationModule),
  ],
  controllers: [AdminSettingController],
  providers: [AdminSettingRepository, AdminSettingService],
  exports: [AdminSettingRepository],
})
export class AdminSettingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    // consumer.apply(AuthMiddleware).forRoutes(
    //   { path: '/', method: RequestMethod.GET },
    //   // { path: 'user/signup-signin-otp', method: RequestMethod.POST },
    // );
    // consumer.apply(AuthMiddleware).forRoutes('user');
  }
}
