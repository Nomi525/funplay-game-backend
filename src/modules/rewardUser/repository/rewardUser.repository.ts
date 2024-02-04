import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Logger from 'src/core/Logger';
import { RewardUser } from '../entities/rewardUser.entity';

@Injectable()
export default class RewardUserRepository {
  constructor(
    @InjectModel(RewardUser.name)
    private readonly rewardUserModel: Model<RewardUser>,
  ) {}

  public async createUserReward(data: any): Promise<any> {
    try {
      Logger.access.info('user.repository --> info of createUserReward()');

      const rewardCreateData = await new this.rewardUserModel({
        userId: data.userId,
        title: data.title,
        points: data.rewardsPoints,
        description: data.description,
      }).save();

      return rewardCreateData;
    } catch (error) {
      Logger.error.error(
        'user.repository --> createUserReward() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async countDocuments(data: any): Promise<any> {
    try {
      Logger.access.info('user.repository --> info of countDocuments()');
      return await this.rewardUserModel.countDocuments({
        data,
      });
    } catch (error) {
      Logger.error.error(
        'user.repository --> countDocuments() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
