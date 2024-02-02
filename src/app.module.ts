import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import CorsMiddleware from './middlewares/cors.middleware';
import UserSchema, { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import AdminSchema, { Admin } from './modules/admin/entities/admin.entity';
import { AdminModule } from './modules/admin/admin.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import NewTransactionSchema, {
  NewTransaction,
} from './modules/transaction/entities/transaction.entity';
import { RoleModule } from './modules/role/role.module';
import RoleSchema, { Role } from './modules/role/entities/role.entity';
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
    ]),
    ScheduleModule.forRoot(),
    UserModule,
    AdminModule,
    TransactionModule,
    RoleModule,
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
