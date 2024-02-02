import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from './controllers/role.controller';
import RoleRepository from './repository/role.repository';
import { RoleService } from './services/role.service';
import RoleSchema, { Role } from './entities/role.entity';
import AuthMiddleware from 'src/middlewares/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],
  providers: [RoleRepository, RoleService],
  exports: [RoleRepository, RoleService],
})
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'role/get-roles', method: RequestMethod.GET },
      { path: 'role/get-single-role/:roleId', method: RequestMethod.GET },
      { path: 'role/delete-role', method: RequestMethod.DELETE },
      { path: 'role/role-add-edit', method: RequestMethod.POST },

      // { path: 'user/signup-signing-otp', method: RequestMethod.POST },
    );
    // consumer
    //   .apply(FileUploadMiddleware)
    //   .forRoutes({ path: 'admin/profile-update', method: RequestMethod.POST });
  }
}
