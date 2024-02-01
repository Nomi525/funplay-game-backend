import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminSetting } from '../entities/adminSetting.entity';
import Logger from 'src/core/Logger';

@Injectable()
export default class AdminSettingRepository {
  constructor(
    @InjectModel(AdminSetting.name)
    private readonly adminSettingModel: Model<AdminSetting>,
  ) {}

  public async getAdminSettingReward(): Promise<any> {
    try {
      Logger.access.info(
        'adminSetting.repository --> info of getAdminSettingReward() for login and register users',
      );
      return await this.adminSettingModel
        .findOne({})
        .select('rewardsPoints rewardsPoints joiningBonus');
    } catch (error) {
      Logger.error.error(
        'adminSetting.repository --> getAdminSettingReward() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  // public async createUserReferral(data: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of createUserReferral()');
  //     return await this.referralUserModel.create({
  //       userId: data._id,
  //       referralUser: data._id,
  //       referralByCode: data.referralByCode,
  //     });
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> createUserReferral() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
