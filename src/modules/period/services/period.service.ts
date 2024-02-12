import { BadRequestException, Injectable } from '@nestjs/common';
import CommonRepository from 'src/helpers/commonRepository';
import PeriodRepository from '../repository/period.repository';
import Logger from 'src/core/Logger';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from 'src/helpers/commonService';
import { PeriodEnum } from '../constants/enums/period.enum';

@Injectable()
export class PeriodService extends CommonRepository {
  constructor(private readonly periodRepository: PeriodRepository) {
    super();
  }

  // // From get unique ids get in array of object
  // private async getUniqueUserIds(data: any) {
  //   const uniqueUserIds = new Set(
  //     data.map((entry: any) => String(entry.userId)),
  //   );
  //   return [...uniqueUserIds];
  // }
  // public async getPeriodsDetailsForAllGame(
  //   req: Request | any,
  //   res: Response,
  // ): Promise<any> {
  //   try {
  //     let gamePeriod = [];
  //     const getAllPeriod =
  //       await this.periodRepository.getPeriodsDetailsForAllGameData();

  //     if (getAllPeriod.length) {
  //       await Promise.all(
  //         getAllPeriod.map(async (item: any, i: any) => {
  //           const sNo = i + 1;
  //           if (
  //             item.gameName == '3 Color Betting' ||
  //             item.gameName == '2 Color Betting'
  //           ) {
  //             const gameType =
  //               item.gameName == '3 Color Betting'
  //                 ? '3colorBetting'
  //                 : '2colorBetting';
  //             const findColours = await ColourBetting.find({
  //               gameType,
  //               gameId: item.gameId,
  //               period: item.period,
  //               selectedTime: item.periodFor,
  //               is_deleted: 0,
  //             });
  //             const uniqueColorUserIds = this.getUniqueUserIds(findColours);
  //             const findWinColour = findColours.find((data) => data.isWin);
  //             let winner = '';
  //             if (findWinColour) {
  //               winner = findWinColour.colourName;
  //             }
  //             gamePeriod.push({
  //               sNo: sNo,
  //               period: item.period,
  //               gameName: item.gameName,
  //               periodFor: item.periodFor,
  //               totalUsers: (await uniqueColorUserIds).length,
  //               totalBetAmount: findColours.reduce(
  //                 (sum: any, data: any) => sum + data.betAmount,
  //                 0,
  //               ),
  //               winner,
  //             });
  //           }
  //         }),
  //       );
  //     }
  //     gamePeriod = await Promise.all(gamePeriod.sort((a, b) => a.sNo - b.sNo));
  //     return sendResponse(
  //       res,
  //       StatusCodes.OK,
  //       PeriodEnum.GAME_PERIOD_GET,
  //       gamePeriod,
  //     );
  //   } catch (error) {
  //     return new BadRequestException(res, error);
  //   }
  // }
  // catch(error: any) {
  //   Logger.error.error(
  //     'period.service --> getPeriodsDetailsForAllGame() indicates error',
  //     error.message,
  //   );
  //   throw new BadRequestException(error.message);
  // }

  // public async getAllGameRecodesGameWise(
  //   req: Request | any,
  //   res: Response,
  //   gameId: any,
  //   gameType: any,
  // ): Promise<any> {
  //   try {
  //     let getAllGamePeriod = [];

  //     if (gameType == '2colorBetting' || gameType == '3colorBetting') {
  //       // For Color Betting
  //       getAllGamePeriod = await ColourBetting.aggregate([
  //         {
  //           $match: {
  //             gameId: new mongoose.Types.ObjectId(gameId),
  //             is_deleted: 0,
  //           },
  //         },
  //         {
  //           $group: {
  //             _id: '$period',
  //             totalUsers: { $sum: 1 },
  //             betAmount: { $sum: '$betAmount' },
  //             winColor: {
  //               $max: {
  //                 $cond: [{ $eq: ['$isWin', true] }, '$colourName', null],
  //               },
  //             },
  //             period: { $first: '$period' },
  //             createdAt: { $first: '$createdAt' },
  //           },
  //         },
  //         {
  //           $sort: {
  //             period: -1,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: 'periods',
  //             localField: 'period',
  //             foreignField: 'period',
  //             as: 'periodData',
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             totalUsers: 1,
  //             price: '$betAmount',
  //             period: 1,
  //             winColor: 1,
  //             createdAt: 1,
  //             periodData: {
  //               $filter: {
  //                 input: '$periodData',
  //                 as: 'pd',
  //                 cond: {
  //                   $eq: ['$$pd.gameId', new mongoose.Types.ObjectId(gameId)],
  //                 },
  //               },
  //             },
  //           },
  //         },
  //         {
  //           $unwind: '$periodData',
  //         },
  //         {
  //           $match: {
  //             winColor: { $ne: null },
  //           },
  //         },
  //         {
  //           $project: {
  //             totalUsers: 1,
  //             winColor: 1,
  //             period: 1,
  //             price: 1,
  //             date: '$periodData.date',
  //             startTime: '$periodData.startTime',
  //             endTime: '$periodData.endTime',
  //             createdAt: '$periodData.createdAt',
  //           },
  //         },
  //       ]);
  //     } else {
  //       return sendResponse(
  //         res,
  //         StatusCodes.BAD_REQUEST,
  //         'Please use valid game type',
  //         [],
  //       );
  //     }
  //     return sendResponse(
  //       res,
  //       StatusCodes.OK,
  //       PeriodEnum.GAME_PERIOD_GET,
  //       getAllGamePeriod,
  //     );
  //   } catch (error: any) {
  //     Logger.error.error(
  //       'period.service --> getPeriodsDetailsForAllGame() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
