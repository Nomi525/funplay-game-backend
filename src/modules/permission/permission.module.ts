import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthMiddleware from 'src/middlewares/auth.middleware';
import { PermissionController } from './controllers/permission.controller';
import PermissionSchema, { Permission } from './entities/permission.entity';
import PermissionRepository from './repository/permission.repository';
import { PermissionService } from './services/permission.service';
import UserSchema, { User } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionRepository, PermissionService],
  exports: [PermissionRepository, PermissionService],
})
export class PermissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'permission/get-all-permission', method: RequestMethod.GET },
      {
        path: 'permission/get-single-permission/:permissionId',
        method: RequestMethod.GET,
      },
      { path: 'permission/delete-permission', method: RequestMethod.DELETE },
      { path: 'permission/permission-add-edit', method: RequestMethod.POST },
      {
        path: 'permission/permission-active-deactive',
        method: RequestMethod.POST,
      },
    );
    // consumer
    //   .apply(FileUploadMiddleware)
    //   .forRoutes({ path: 'admin/profile-update', method: RequestMethod.POST });
  }
}
