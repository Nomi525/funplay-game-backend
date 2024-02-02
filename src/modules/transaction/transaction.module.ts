import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthMiddleware from 'src/middlewares/auth.middleware';
import UserSchema, { User } from '../user/entities/user.entity';
import UserRepository from '../user/repository/user.repository';
import { TransactionController } from './controllers/transaction.controller';
import CurrencyCoinSchema, {
  CurrencyCoin,
} from './entities/currencyCoin.entity';
import NewTransactionSchema, {
  NewTransaction,
} from './entities/transaction.entity';
import TransactionHistorySchema, {
  TransactionHistory,
} from './entities/transactionHistory.entity';
import WithdrawalRequestSchema, {
  WithdrawalRequest,
} from './entities/withdrawalRequest.entity';
import CurrencyCoinRepository from './repository/currencyCoin.repository';
import TransactionRepository from './repository/transaction.repository';
import { TransactionService } from './services/transaction.service';
import TransactionHistoryRepository from './repository/transactionHistory.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewTransaction.name, schema: NewTransactionSchema },
      { name: TransactionHistory.name, schema: TransactionHistorySchema },
      { name: WithdrawalRequest.name, schema: WithdrawalRequestSchema },
      { name: CurrencyCoin.name, schema: CurrencyCoinSchema },
      { name: User.name, schema: UserSchema },
    ]),
    // MongooseModule.forFeature([
    //   { name: AdminSetting.name, schema: AdminSettingSchema },
    // ]),
    // forwardRef(() => AllocationModule),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionRepository,
    TransactionHistoryRepository,
    CurrencyCoinRepository,
    UserRepository,
    TransactionService,
  ],
  exports: [TransactionRepository, TransactionService],
})
export class TransactionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to specific routes using dynamic routing
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'transaction/total-amount-deposit', method: RequestMethod.GET },
      { path: 'transaction/new-transitions', method: RequestMethod.GET },
      {
        path: 'transaction/get-deposit-withdrawal',
        method: RequestMethod.GET,
      },
    );
    // consumer
    //   .apply(FileUploadMiddleware)
  }
}
