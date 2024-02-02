import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewTransaction } from '../entities/transaction.entity';
import Logger from 'src/core/Logger';
import { Currency } from '../entities/Currency.entity';

@Injectable()
export default class TransactionRepository {
  constructor(
    @InjectModel(NewTransaction.name)
    private readonly transactionModel: Model<NewTransaction>,
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<Currency>,
  ) {}

  public async getSingleTransactionData(data: any, filter?: any): Promise<any> {
    try {
      Logger.access.info(
        'transaction.repository --> info of getSingleTransactionData()',
      );
      return await this.transactionModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'transaction.repository --> getSingleTransactionData() indicates error',
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
        'transaction.repository --> getAllTransactionData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async getAllCurrencyData(data: any, filter?: any): Promise<any> {
    try {
      Logger.access.info(
        'transaction.repository --> info of getAllCurrencyData()',
      );
      return await this.currencyModel.find(data);
    } catch (error) {
      Logger.error.error(
        'transaction.repository --> getAllCurrencyData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async transactionDataUpdated(where: any, data: any): Promise<any> {
    try {
      Logger.access.info(
        'transaction.repository --> info of transactionDataUpdated()',
      );
      return await this.transactionModel.findOneAndUpdate(
        where,
        { $set: data },
        { new: true },
      );
    } catch (error) {
      Logger.error.error(
        'transaction.repository --> transactionDataUpdated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async transactionDataCreate(data: any): Promise<any> {
    try {
      Logger.access.info(
        'transaction.repository --> info of transactionDataCreate()',
      );
      return await new this.transactionModel(data).save();
    } catch (error) {
      Logger.error.error(
        'transaction.repository --> transactionDataCreate() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
