import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from '../entities/game.entity';
import Logger from 'src/core/Logger';
import { GameRules } from '../entities/gameRules.entity';
import { GameTime } from '../entities/gameTIme.entity';

@Injectable()
export default class GameRepository {
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
    @InjectModel(GameRules.name)
    private readonly gameRulesModel: Model<GameRules>,
    @InjectModel(GameTime.name)
    private readonly gameTimeModel: Model<GameTime>,
  ) {}

  // public async getReferralUserData(referralByCode: any): Promise<any> {
  //   try {
  //     Logger.access.info(
  //       'game.repository --> info of getReferralUserData() for login and register users',
  //     );
  //     return await this.userModel.findOne({
  //       referralCode: referralByCode,
  //     });
  //   } catch (error) {
  //     Logger.error.error(
  //       'game.repository --> getReferralUserData() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  public async getGamesData(data: any): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of getColourBettingData()',
      );
      return await this.gameModel.find(data).sort({ _id: -1 });
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> getColourBettingData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getSingleGameData(data: any): Promise<any> {
    try {
      Logger.access.info('game.repository --> info of getSingleGameData()');
      return await this.gameModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'game.repository --> getSingleGameData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async getSingleGameRulesData(data: any): Promise<any> {
    try {
      Logger.access.info(
        'game.repository --> info of getSingleGameRulesData()',
      );
      return await this.gameModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'game.repository --> getSingleGameRulesData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async getSingleGameTimeData(data: any): Promise<any> {
    try {
      Logger.access.info('game.repository --> info of getSingleGameTimeData()');
      return await this.gameTimeModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'game.repository --> getSingleGameTimeData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  // public async getUserDataById(id: any): Promise<any> {
  //   try {
  //     Logger.access.info('game.repository --> info of getUserDataById()');
  //     return await this.userModel.findById(id);
  //   } catch (error) {
  //     Logger.error.error(
  //       'game.repository --> getUserDataById() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // public async colourBettingDataCreated(data: any): Promise<any> {
  //   try {
  //     Logger.access.info(
  //       'colourBetting.repository --> info of colourBettingDataCreated()',
  //     );
  //     return await new this.colourBettingModel(data).save();
  //   } catch (error) {
  //     Logger.error.error(
  //       'colourBetting.repository --> colourBettingDataCreated() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // public async winners(gameType: any, gameId: any, period: any): Promise<any> {
  //   try {
  //     Logger.access.info('colourBetting.repository --> info of winners()');
  //     const query: any = {
  //       gameId: new SchemaTypes.ObjectId(gameId),
  //       period: parseInt(period),
  //       is_deleted: 0,
  //     };

  //     if (gameType == '2colorBetting' || gameType == '3colorBetting') {
  //       query.gameType = gameType;
  //     }
  //     const bettingResult = await this.colourBettingModel.aggregate([
  //       {
  //         $match: query,
  //       },
  //       {
  //         $lookup: {
  //           from: 'games',
  //           localField: 'gameId',
  //           foreignField: '_id',
  //           as: 'game',
  //         },
  //       },
  //       {
  //         $unwind: '$game',
  //       },
  //       {
  //         $sort: {
  //           betAmount: 1,
  //           createdAt: 1,
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: {
  //             gameId: '$game._id',
  //             gameName: '$game.gameName',
  //             gameImage: '$game.gameImage',
  //             gameDuration: '$game.gameDuration',
  //             isActive: '$game.isActive',
  //             startTime: '$game.startTime',
  //             endTime: '$game.endTime',
  //             startDate: '$game.startDate',
  //             endDate: '$game.endDate',
  //           },
  //           bets: { $push: '$$ROOT' },
  //         },
  //       },
  //       {
  //         $unwind: '$bets',
  //       },
  //       {
  //         $group: {
  //           _id: {
  //             gameId: '$_id.gameId',
  //             gameName: '$_id.gameName',
  //             gameImage: '$_id.gameImage',
  //             gameDuration: '$_id.gameDuration',
  //             isActive: '$_id.isActive',
  //             startTime: '$_id.startTime',
  //             endTime: '$_id.endTime',
  //             startDate: '$_id.startDate',
  //             endDate: '$_id.endDate',
  //             userId: '$bets.userId',
  //           },
  //           bets: { $first: '$bets' },
  //           totalBetAmount: { $sum: '$bets.betAmount' },
  //         },
  //       },
  //       {
  //         $sort: {
  //           totalBetAmount: 1,
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: null,
  //           winner: { $first: '$_id.userId' },
  //           gameDetails: {
  //             $first: {
  //               gameId: '$_id.gameId',
  //               gameName: '$_id.gameName',
  //               gameImage: '$_id.gameImage',
  //               gameDuration: '$_id.gameDuration',
  //               isActive: '$_id.isActive',
  //               startTime: '$_id.startTime',
  //               endTime: '$_id.endTime',
  //               startDate: '$_id.startDate',
  //               endDate: '$_id.endDate',
  //             },
  //           },
  //           bets: { $push: '$bets' },
  //         },
  //       },
  //     ]);
  //     // return bettingResult;
  //     if (bettingResult) {
  //       return await this.winnerDetails(
  //         gameType,
  //         gameId,
  //         period,
  //         bettingResult,
  //       );
  //     }
  //     return [];
  //   } catch (error) {
  //     Logger.error.error(
  //       'colourBetting.repository --> colourBettingDataCreated() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // public async colourBettingDataUpdated(where: any, data: any): Promise<any> {
  //   try {
  //     Logger.access.info(
  //       'colourBetting.repository --> info of colourBettingDataUpdated()',
  //     );
  //     return await this.colourBettingModel.findOneAndUpdate(
  //       where,
  //       { $set: data },
  //       { new: true },
  //     );
  //   } catch (error) {
  //     Logger.error.error(
  //       'colourBetting.repository --> colourBettingDataUpdated() indicates error',
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
  //     Logger.access.info('game.repository --> info of userDataUpdatedById()');
  //     return await this.userModel.findByIdAndUpdate(
  //       id,
  //       { $set: data },
  //       { new: true, ...extra },
  //     );
  //   } catch (error) {
  //     Logger.error.error(
  //       'game.repository --> userDataUpdatedById() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
