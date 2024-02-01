import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewTransaction } from '../entities/transaction.entity';
import Logger from 'src/core/Logger';

@Injectable()
export default class TransactionRepository {
  constructor(
    @InjectModel(NewTransaction.name)
    private readonly transactionModel: Model<NewTransaction>,
  ) {}

  public async getSingleTransactionData(data: any, filter?: any): Promise<any> {
    try {
      Logger.access.info(
        'transaction.repository --> info of getSingleTransactionData()',
      );
      return await this.transactionModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'user.repository --> getSingleTransactionData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getAllTransactionData(data: any, filter?: any): Promise<any> {
    try {
      Logger.access.info(
        'transaction.repository --> info of getAllTransactionData()',
      );
      return await this.transactionModel.find(data);
    } catch (error) {
      Logger.error.error(
        'user.repository --> getAllTransactionData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
