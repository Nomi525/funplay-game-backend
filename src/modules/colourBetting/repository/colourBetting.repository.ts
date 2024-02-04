import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ColourBetting } from '../entities/colourBetting.entity';
import Logger from 'src/core/Logger';

@Injectable()
export default class ColourBettingRepository {
  constructor(
    @InjectModel(ColourBetting.name)
    private readonly colourBettingModel: Model<ColourBetting>,
  ) {}

  // public async getReferralUserData(referralByCode: any): Promise<any> {
  //   try {
  //     Logger.access.info(
  //       'user.repository --> info of getReferralUserData() for login and register users',
  //     );
  //     return await this.userModel.findOne({
  //       referralCode: referralByCode,
  //     });
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> getReferralUserData() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  public async getColourBettingData(data: any): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of getColourBettingData()',
      );
      return await this.colourBettingModel.find(data);
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> getColourBettingData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  // public async getSingleUserData(data: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of getSingleUserData()');
  //     return await this.userModel.findOne(data);
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> getSingleUserData() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // public async getUserDataById(id: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of getUserDataById()');
  //     return await this.userModel.findById(id);
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> getUserDataById() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // public async userDataCreate(data: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of userDataCreate()');
  //     return await new this.userModel(data).save();
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> userDataCreate() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // public async userDataUpdated(where: any, data: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of userDataUpdated()');
  //     return await this.userModel.findOneAndUpdate(
  //       where,
  //       { $set: data },
  //       { new: true },
  //     );
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> userDataUpdated() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // public async userDataUpdatedById(
  //   id: any,
  //   data: any,
  //   extra: any,
  // ): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of userDataUpdatedById()');
  //     return await this.userModel.findByIdAndUpdate(
  //       id,
  //       { $set: data },
  //       { new: true, ...extra },
  //     );
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> userDataUpdatedById() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
