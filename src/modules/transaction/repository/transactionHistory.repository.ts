import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Logger from 'src/core/Logger';
import { TransactionHistory } from '../entities/transactionHistory.entity';

@Injectable()
export default class TransactionHistoryRepository {
  constructor(
    @InjectModel(TransactionHistory.name)
    private readonly transactionHistoryModel: Model<TransactionHistory>,
  ) {}

  public async getSingleTransactionHistoryData(
    data: any,
    filter?: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'transactionHistory.repository --> info of getSingleTransactionHistoryData()',
      );
      return await this.transactionHistoryModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'transactionHistory.repository --> getSingleTransactionHistoryData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getAllTransactionHistoryData(
    data: any,
    filter?: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'transactionHistory.repository --> info of getAllTransactionHistoryData()',
      );
      return await this.transactionHistoryModel.find(data);
    } catch (error) {
      Logger.error.error(
        'transactionHistory.repository --> getAllTransactionHistoryData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async transactionHistoryDataUpdated(
    where: any,
    data: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'transactionHistory.repository --> info of getAllTransactionHistoryData()',
      );
      return await this.transactionHistoryModel.findOneAndUpdate(
        where,
        { $set: data },
        { new: true },
      );
    } catch (error) {
      Logger.error.error(
        'transactionHistory.repository --> getAllTransactionHistoryData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async transactionHistoryDataCreate(data: any): Promise<any> {
    try {
      Logger.access.info(
        'transactionHistory.repository --> info of transactionDataCreate()',
      );
      return await new this.transactionHistoryModel(data).save();
    } catch (error) {
      Logger.error.error(
        'transactionHistory.repository --> transactionDataCreate() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
