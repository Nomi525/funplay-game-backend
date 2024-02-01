import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReferralUser } from '../entities/referralUser.entity';
import Logger from 'src/core/Logger';

@Injectable()
export default class ReferralUserRepository {
  constructor(
    @InjectModel(ReferralUser.name)
    private readonly referralUserModel: Model<ReferralUser>,
  ) {}

  public async createUserReferral(data: any): Promise<any> {
    try {
      Logger.access.info('user.repository --> info of createUserReferral()');
      return await this.referralUserModel.create({
        userId: data._id,
        referralUser: data._id,
        referralByCode: data.referralByCode,
      });
    } catch (error) {
      Logger.error.error(
        'user.repository --> createUserReferral() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
