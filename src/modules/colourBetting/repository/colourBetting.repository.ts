import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SchemaTypes } from 'mongoose';
import { ColourBetting } from '../entities/colourBetting.entity';
import Logger from 'src/core/Logger';
import { helperUtil } from 'src/helpers/helperUtils';
import { NewTransaction } from 'src/modules/transaction/entities/transaction.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { GameReward } from 'src/modules/game/entities/gameReward.entity';

@Injectable()
export default class ColourBettingRepository {
  constructor(
    @InjectModel(ColourBetting.name)
    private readonly colourBettingModel: Model<ColourBetting>,
    @InjectModel(NewTransaction.name)
    private readonly newTransactionModel: Model<NewTransaction>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(GameReward.name)
    private readonly gameRewardModel: Model<GameReward>,
  ) {}

  public async getColourBettingData(
    data: any,
    filter1?: any,
    filter2?: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of getColourBettingData()',
      );
      if (filter1 == 'user' && filter2 == 'game') {
        return await this.colourBettingModel
          .find(data)
          .populate('userId', 'email fullName isLogin currency')
          .populate('gameId', 'gameName gameTime gameMode')
          .sort({ createdAt: -1 });
      }
      return await this.colourBettingModel
        .find(data)
        .sort({
          createdAt: -1,
        })
        .lean();
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> getColourBettingData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getSingleColourBettingData(data: any): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of getSingleColourBettingData()',
      );
      return await this.colourBettingModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> getSingleColourBettingData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getUserDataById(id: any): Promise<any> {
    try {
      Logger.access.info('user.repository --> info of getUserDataById()');
      return await this.userModel.findById(id);
    } catch (error) {
      Logger.error.error(
        'user.repository --> getUserDataById() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async colourBettingDataCreated(data: any): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of colourBettingDataCreated()',
      );
      return await new this.colourBettingModel(data).save();
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> colourBettingDataCreated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async winners(gameType: any, gameId: any, period: any): Promise<any> {
    try {
      Logger.access.info('colourBetting.repository --> info of winners()');
      const query: any = {
        gameId: new SchemaTypes.ObjectId(gameId),
        period: parseInt(period),
        is_deleted: 0,
      };

      if (gameType == '2colorBetting' || gameType == '3colorBetting') {
        query.gameType = gameType;
      }
      const bettingResult = await this.colourBettingModel.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'games',
            localField: 'gameId',
            foreignField: '_id',
            as: 'game',
          },
        },
        {
          $unwind: '$game',
        },
        {
          $sort: {
            betAmount: 1,
            createdAt: 1,
          },
        },
        {
          $group: {
            _id: {
              gameId: '$game._id',
              gameName: '$game.gameName',
              gameImage: '$game.gameImage',
              gameDuration: '$game.gameDuration',
              isActive: '$game.isActive',
              startTime: '$game.startTime',
              endTime: '$game.endTime',
              startDate: '$game.startDate',
              endDate: '$game.endDate',
            },
            bets: { $push: '$$ROOT' },
          },
        },
        {
          $unwind: '$bets',
        },
        {
          $group: {
            _id: {
              gameId: '$_id.gameId',
              gameName: '$_id.gameName',
              gameImage: '$_id.gameImage',
              gameDuration: '$_id.gameDuration',
              isActive: '$_id.isActive',
              startTime: '$_id.startTime',
              endTime: '$_id.endTime',
              startDate: '$_id.startDate',
              endDate: '$_id.endDate',
              userId: '$bets.userId',
            },
            bets: { $first: '$bets' },
            totalBetAmount: { $sum: '$bets.betAmount' },
          },
        },
        {
          $sort: {
            totalBetAmount: 1,
          },
        },
        {
          $group: {
            _id: null,
            winner: { $first: '$_id.userId' },
            gameDetails: {
              $first: {
                gameId: '$_id.gameId',
                gameName: '$_id.gameName',
                gameImage: '$_id.gameImage',
                gameDuration: '$_id.gameDuration',
                isActive: '$_id.isActive',
                startTime: '$_id.startTime',
                endTime: '$_id.endTime',
                startDate: '$_id.startDate',
                endDate: '$_id.endDate',
              },
            },
            bets: { $push: '$bets' },
          },
        },
      ]);
      // return bettingResult;
      if (bettingResult) {
        return await this.winnerDetails(
          gameType,
          gameId,
          period,
          bettingResult,
        );
      }
      return [];
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> colourBettingDataCreated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async winnerDetails(
    gameType: any,
    gameId: any,
    period: any,
    bettingResult: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of winnerDetails()',
      );
      const winner = await Promise.all(
        bettingResult.map(async (bet: any) => {
          if (bet.gameDetails.gameId.toString() == gameId.toString()) {
            let winnerDetails: any = await this.userModel.findOne({
              _id: bet.winner,
            });
            let rewardAmount: any = 0;
            if (winnerDetails) {
              if (bet.bets && bet.bets.length) {
                bet.bets.map(async (b: any) => {
                  if (b.userId.toString() == winnerDetails._id.toString()) {
                    rewardAmount = helperUtil.multiplicationLargeSmallValue(
                      b.betAmount,
                      0.95,
                    );
                    const balance: any = await this.newTransactionModel.findOne(
                      {
                        userId: winnerDetails._id,
                      },
                    );
                    if (balance) {
                      balance.totalCoin = helperUtil.plusLargeSmallValue(
                        balance.totalCoin,
                        b.betAmount + rewardAmount,
                      );
                      await balance.save();
                    }
                    if (
                      gameType == '2colorBetting' ||
                      gameType == '3colorBetting'
                    ) {
                      await this.colourBettingModel.updateOne(
                        {
                          userId: winnerDetails._id,
                          gameId: bet.gameDetails.gameId,
                          period,
                        },
                        { $set: { rewardAmount, isWin: true } },
                      );
                    } else {
                      // await NumberBetting.updateOne(
                      //   {
                      //     userId: winnerDetails._id,
                      //     gameId: bet.gameDetails.gameId,
                      //     period,
                      //   },
                      //   { $set: { rewardAmount, isWin: true } },
                      // );
                    }
                    await this.gameRewardModel.create({
                      userId: winnerDetails._id,
                      gameId: bet.gameDetails.gameId,
                      betId: b._id,
                      betAmount: b.betAmount,
                      colourName: b.colourName,
                      rewardAmount,
                    });
                  }
                });
              }
              let winColour: any;
              let winNumber: any;
              const winBet = bet.bets.find(
                (item: any) => bet.winner.toString() == item.userId.toString(),
              );
              if (gameType == '2colorBetting' || gameType == '3colorBetting') {
                winColour = winBet ? winBet.colourName : '';
              } else {
                winNumber = winBet ? winBet.number : 0;
              }
              winnerDetails = {
                ...winnerDetails._doc,
                winColour,
                winNumber,
                rewardAmount,
              };
              bet.winner = winnerDetails;
            }
          }
          return bet;
        }),
      );
      return winner;
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> winnerDetails() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async colourBettingDataUpdated(where: any, data: any): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of colourBettingDataUpdated()',
      );
      return await this.colourBettingModel.findOneAndUpdate(
        where,
        { $set: data },
        { new: true },
      );
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> colourBettingDataUpdated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async colourBettingDataUpdateMany(
    where: any,
    data: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of colourBettingDataUpdated()',
      );
      return await this.colourBettingModel.updateMany(where, { $set: data });
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> colourBettingDataUpdated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

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

  public async calculateTotalReward(query: any): Promise<any> {
    try {
      Logger.access.info(
        'colourBetting.repository --> info of calculateTotalReward()',
      );
      const bettingData = await this.colourBettingModel.find({
        ...query,
        is_deleted: 0,
      });
      return bettingData.reduce(
        (total: any, data: any) => total + Number(data.rewardAmount),
        0,
      );
    } catch (error) {
      Logger.error.error(
        'colourBetting.repository --> calculateTotalReward() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
