import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import CorsMiddleware from './middlewares/cors.middleware';
import { AdminModule } from './modules/admin/admin.module';
import AdminSchema, { Admin } from './modules/admin/entities/admin.entity';
import PermissionSchema, {
  Permission,
} from './modules/permission/entities/permission.entity';
import { PermissionModule } from './modules/permission/permission.module';
import RoleSchema, { Role } from './modules/role/entities/role.entity';
import { RoleModule } from './modules/role/role.module';
import NewTransactionSchema, {
  NewTransaction,
} from './modules/transaction/entities/transaction.entity';
import { TransactionModule } from './modules/transaction/transaction.module';
import UserSchema, { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
// import express from 'express';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // Add any additional MongoDB connection options here
      dbName: 'studentdb',
    }),
    MongooseModule.forFeature([
      // { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: NewTransaction.name, schema: NewTransactionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    ScheduleModule.forRoot(),
    UserModule,
    AdminModule,
    TransactionModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
    // consumer.apply(express.json()).forRoutes('*');
  }
}
