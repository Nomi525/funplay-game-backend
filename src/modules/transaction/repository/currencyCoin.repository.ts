import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Logger from 'src/core/Logger';
import { CurrencyCoin } from '../entities/currencyCoin.entity';

@Injectable()
export default class CurrencyCoinRepository {
  constructor(
    @InjectModel(CurrencyCoin.name)
    private readonly currencyCoinModel: Model<CurrencyCoin>,
  ) {}

  public async getSingleCurrencyCoinData(
    data: any,
    filter?: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'currencyCoin.repository --> info of getSingleCurrencyCoinData()',
      );
      return await this.currencyCoinModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'currencyCoin.repository --> getSingleCurrencyCoinData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getAllCurrencyCoinModelData(
    data: any,
    filter?: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'currencyCoin.repository --> info of getAllCurrencyCoinModelData()',
      );
      return await this.currencyCoinModel.find(data);
    } catch (error) {
      Logger.error.error(
        'currencyCoin.repository --> getAllCurrencyCoinModelData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
