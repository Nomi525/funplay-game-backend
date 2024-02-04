import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameReward } from '../entities/gameReward.entity';
import Logger from 'src/core/Logger';

@Injectable()
export default class GameRewardRepository {
  constructor(
    @InjectModel(GameReward.name)
    private readonly gameRewardModel: Model<GameReward>,
  ) {}

  public async gameRewardDataCreated(data: any): Promise<any> {
    try {
      Logger.access.info(
        'gameReward.repository --> info of gameRewardDataCreated()',
      );
      return await new this.gameRewardModel(data).save();
    } catch (error) {
      Logger.error.error(
        'gameReward.repository --> gameRewardDataCreated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
