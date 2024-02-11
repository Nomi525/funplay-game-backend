import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameReward } from '../entities/gameReward.entity';

@Injectable()
export default class GameRewardRepository {
  constructor(
    @InjectModel(GameReward.name)
    private readonly gameRewardModel: Model<GameReward>,
  ) {}
}
