import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthMiddleware from 'src/middlewares/auth.middleware';
import { AdminController } from './controllers/admin.controller';
import AdminSchema, { Admin } from './entities/admin.entity';
import AdminRepository from './repository/admin.repository';
import { AdminService } from './services/admin.service';
import UserSchema, { User } from '../user/entities/user.entity';
import { FileUploadMiddleware } from 'src/middlewares/fileUpload.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // MongooseModule.forFeature([
    //   { name: AdminSetting.name, schema: AdminSettingSchema },
    // ]),
    // forwardRef(() => AllocationModule),
  ],
  controllers: [AdminController],
  providers: [
    AdminRepository,
    AdminService,
    // ReferralUserRepository,
    // RewardUserService,
    // RewardUserRepository,
    // AdminSettingRepository,
    // UserService,
  ],
  exports: [AdminRepository, AdminService],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'admin/change-password', method: RequestMethod.POST },
      { path: 'admin/profile', method: RequestMethod.GET },
      { path: 'admin/profile-update', method: RequestMethod.POST },
      { path: 'admin/logout', method: RequestMethod.POST },
      { path: 'admin/get-role-admin', method: RequestMethod.GET },
      // { path: 'user/signup-signing-otp', method: RequestMethod.POST },
    );
    consumer
      .apply(FileUploadMiddleware)
      .forRoutes({ path: 'admin/profile-update', method: RequestMethod.POST });
  }
}
