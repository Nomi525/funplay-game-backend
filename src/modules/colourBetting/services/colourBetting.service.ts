import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import Logger from 'src/core/Logger';
import CommonRepository from 'src/helpers/commonRepository';
import { sendResponse } from 'src/helpers/commonService';
import { helperUtil } from 'src/helpers/helperUtils';
import GameRepository from 'src/modules/game/repository/game.repository';
import TransactionRepository from 'src/modules/transaction/repository/transaction.repository';
import UserRepository from 'src/modules/user/repository/user.repository';
import { ColourBettingEnum } from '../constants/enums/colourBetting.enum';
import {
  AddColourBettingRequestDto,
  ColourBettingBetResultRequestDto,
} from '../dto/colourBetting.dto';
import ColourBettingRepository from '../repository/colourBetting.repository';

@Injectable()
export class ColourBettingService extends CommonRepository {
  constructor(
    private readonly colourBettingRepository: ColourBettingRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly gameRepository: GameRepository,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  private async processData(data: any): Promise<any> {
    const processedData = {};
    data.forEach((item: any, i: any) => {
      const userId = item.userId._id;
      const betAmount = parseFloat(item.betAmount);
      const rewardAmount = parseFloat(item.rewardAmount);
      if (!processedData[userId]) {
        processedData[userId] = {
          user: item.userId,
          game: item.gameId,
          betDetails: [],
        };
      }
      if (processedData[userId].betDetails.length) {
        const index = processedData[userId].betDetails.findIndex(
          (item: any) => item.betAmount == betAmount,
        );
        if (index != -1) {
          processedData[userId].betDetails[index].betTimes++;
          processedData[userId].betDetails[index].betTotalAmount += betAmount;
        } else {
          processedData[userId].betDetails.push({
            betAmount: betAmount,
            betTimes: 1,
            betTotalAmount: betAmount,
          });
        }
      } else {
        processedData[userId].betDetails.push({
          betAmount: betAmount,
          betTimes: 1,
          betTotalAmount: betAmount,
        });
      }
    });
    const result = Object.values(processedData);
    return result;
  }

  public async addColourBet(
    req: Request | any,
    res: Response,
    addColourBettingRequestDto: AddColourBettingRequestDto,
  ): Promise<any> {
    try {
      if (Number(addColourBettingRequestDto.betAmount) < 0) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ColourBettingEnum.VALID_BET_AMOUNT,
          [],
        );
      }
      const checkBalance =
        await this.transactionRepository.getSingleTransactionData({
          userId: req.user,
          is_deleted: 0,
        });
      if (!checkBalance) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ColourBettingEnum.INSUFFICIENT_BALANCE,
          [],
        );
      }
      if (
        parseInt(checkBalance.totalCoin) <
        parseInt(addColourBettingRequestDto.betAmount)
      ) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ColourBettingEnum.INSUFFICIENT_BALANCE,
          [],
        );
      }
      if (
        !helperUtil.checkDecimalValueGreaterThanOrEqual(
          checkBalance.totalCoin,
          addColourBettingRequestDto.betAmount,
        )
      ) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ColourBettingEnum.INSUFFICIENT_BALANCE,
          [],
        );
      }

      // let alreadyExistBet = await ColourBetting.findOne({
      //   userId: req.user,
      //   gameId: gameId,
      //   gameType,
      //   period,
      // });
      // let createColourBet;
      // if (alreadyExistBet) {
      //   createColourBet = await dataUpdated(
      //     {
      //       userId: req.user,
      //     },
      //     {
      //       colourName: colourName,
      //       betAmount: parseInt(betAmount),
      //     },
      //     ColourBetting
      //   );
      // } else {
      //   createColourBet = await dataCreate(
      //     {
      //       userId: req.user,
      //       gameId: gameId,
      //       colourName: colourName,
      //       betAmount: parseInt(betAmount),
      //       gameType,
      //       period,
      //       selectedTime
      //     },
      //     ColourBetting
      //   );
      // }

      const createColourBet =
        await this.colourBettingRepository.colourBettingDataCreated({
          userId: req.user,
          gameId: addColourBettingRequestDto.gameId,
          colourName: addColourBettingRequestDto.colourName,
          betAmount: parseInt(addColourBettingRequestDto.betAmount),
          gameType: addColourBettingRequestDto.gameType,
          period: addColourBettingRequestDto.period,
          selectedTime: addColourBettingRequestDto.selectedTime,
          status: 'pending',
        });

      if (createColourBet) {
        checkBalance.totalCoin = helperUtil.minusLargeSmallValue(
          checkBalance.totalCoin,
          addColourBettingRequestDto.betAmount,
        );
        if (parseFloat(checkBalance.betAmount)) {
          checkBalance.betAmount = helperUtil.plusLargeSmallValue(
            checkBalance.betAmount,
            addColourBettingRequestDto.betAmount,
          );
        } else {
          checkBalance.betAmount = addColourBettingRequestDto.betAmount;
        }
        await checkBalance.save();
        return sendResponse(
          res,
          StatusCodes.CREATED,
          ColourBettingEnum.COLOR_BET_CRATED,
          createColourBet,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ColourBettingEnum.FAILED_TO_CREATE,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'colourBetting.service --> deleteRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async colourBetResult(
    req: Request | any,
    res: Response,
    colourBettingBetResultRequestDto: ColourBettingBetResultRequestDto,
  ): Promise<any> {
    try {
      let bettingResult = [];
      let message = '';
      if (!colourBettingBetResultRequestDto.type) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ColourBettingEnum.TYPE_REQUIRED,
          [],
        );
      }
      const findGameMode = await this.gameRepository.getSingleGameData({
        _id: colourBettingBetResultRequestDto.gameId,
        gameMode: 'Manual',
        is_deleted: 0,
      });
      if (findGameMode) {
        await this.colourBettingRepository.colourBettingDataUpdated(
          {
            gameId: colourBettingBetResultRequestDto.gameId,
            period: colourBettingBetResultRequestDto.period,
          },
          { status: 'pending' },
        );
        return sendResponse(
          res,
          StatusCodes.OK,
          ColourBettingEnum.WINNER_DECLARE_MANUAL,
          [],
        );
      }
      // Check type for number betting
      if (
        colourBettingBetResultRequestDto.gameType == 'number' &&
        colourBettingBetResultRequestDto.type == 'numberBetting'
      ) {
        const numberBettingResult = await this.colourBettingRepository.winners(
          colourBettingBetResultRequestDto.gameType,
          colourBettingBetResultRequestDto.gameId,
          colourBettingBetResultRequestDto.period,
        );
        if (numberBettingResult.length) {
          bettingResult = numberBettingResult;
          message = ColourBettingEnum.NUMBER_RESULT;
        }
      }
      // Check type for color betting
      if (colourBettingBetResultRequestDto.type == 'colorBetting') {
        if (
          colourBettingBetResultRequestDto.gameType == '2colorBetting' ||
          colourBettingBetResultRequestDto.gameType == '3colorBetting'
        ) {
          const colourBettingResult =
            await this.colourBettingRepository.winners(
              colourBettingBetResultRequestDto.gameType,
              colourBettingBetResultRequestDto.gameId,
              colourBettingBetResultRequestDto.period,
            );
          if (colourBettingResult.length) {
            bettingResult = colourBettingResult;
            message = ColourBettingEnum.COLOR_RESULT;
          }
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            ColourBettingEnum.GAME_TYPE_REQUIRED,
            [],
          );
        }
      }

      if (bettingResult.length) {
        return sendResponse(res, StatusCodes.OK, message, bettingResult);
      }
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ColourBettingEnum.FAILED_TO_FETCH,
        [],
      );
    } catch (error) {
      Logger.error.error(
        'colourBetting.service --> colourBetResult() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getAllGameWiseWinner(
    req: Request | any,
    res: Response,
    gameId: string,
  ): Promise<any> {
    try {
      const colorUserList =
        await this.colourBettingRepository.getColourBettingData(
          {
            userId: { $ne: req.user },
            isWin: true,
            gameId,
          },
          'user',
          'game',
        );
      const processedData = await this.processData(colorUserList);
      return sendResponse(
        res,
        StatusCodes.OK,
        ColourBettingEnum.COLOR_USER_LIST,
        processedData,
      );
    } catch (error) {
      Logger.error.error(
        'colourBetting.service --> getAllGameWiseWinner() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getSingleGameWiseWinner(
    req: Request | any,
    res: Response,
    gameId: string,
  ): Promise<any> {
    try {
      const colorUserList =
        await this.colourBettingRepository.getColourBettingData(
          {
            userId: req.user,
            gameId,
          },
          'user',
          'game',
        );
      // const processedData = {};
      // colorUserList.forEach((item, i) => {
      //   const userId = item.userId._id;
      //   const betAmount = parseFloat(item.betAmount);
      //   const rewardAmount = parseFloat(item.rewardAmount);
      //   if (!processedData[userId]) {
      //     processedData[userId] = {
      //       user: item.userId,
      //       game: item.gameId,
      //       winBetDetails: [],
      //       lossBetDetails: [],
      //     };
      //   }
      //   if (item.isWin) {
      //     if (processedData[userId].winBetDetails.length) {
      //       const index = processedData[userId].winBetDetails.findIndex(
      //         (item) => item.betAmount == betAmount,
      //       );
      //       if (index != -1) {
      //         processedData[userId].winBetDetails[index].betTimes++;
      //         processedData[userId].winBetDetails[index].betTotalAmount +=
      //           betAmount;
      //       } else {
      //         processedData[userId].winBetDetails.push({
      //           betAmount: betAmount,
      //           betTimes: 1,
      //           betTotalAmount: betAmount,
      //         });
      //       }
      //     } else {
      //       processedData[userId].winBetDetails.push({
      //         betAmount: betAmount,
      //         betTimes: 1,
      //         betTotalAmount: betAmount,
      //       });
      //     }
      //   } else {
      //     if (processedData[userId].lossBetDetails.length) {
      //       const index = processedData[userId].lossBetDetails.findIndex(
      //         (item) => item.betAmount == betAmount,
      //       );
      //       if (index != -1) {
      //         processedData[userId].lossBetDetails[index].betTimes++;
      //         processedData[userId].lossBetDetails[index].betTotalAmount +=
      //           betAmount;
      //       } else {
      //         processedData[userId].lossBetDetails.push({
      //           betAmount: betAmount,
      //           betTimes: 1,
      //           betTotalAmount: betAmount,
      //         });
      //       }
      //     } else {
      //       processedData[userId].lossBetDetails.push({
      //         betAmount: betAmount,
      //         betTimes: 1,
      //         betTotalAmount: betAmount,
      //       });
      //     }
      //   }
      // });
      const processedData = await this.processData(colorUserList);
      return processedData;
    } catch (error) {
      Logger.error.error(
        'colourBetting.service --> getAllGameWiseWinner() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getLoginUserColourBet(
    req: Request | any,
    res: Response,
  ): Promise<any> {
    try {
      const findUser = await this.userRepository.getSingleUserData(
        {
          _id: req.user,
          is_deleted: 0,
        },
        'getLoginUserColourBet',
      );

      const findBets = await this.colourBettingRepository.getColourBettingData({
        userId: req.user,
      });

      const winAmount = findBets
        .filter((b: any) => b.isWin)
        .reduce((a: any, d: any) => a + parseFloat(d.rewardAmount), 0);
      const lossAmount = findBets
        .filter((b: any) => !b.isWin)
        .reduce((a: any, d: any) => a + parseFloat(d.betAmount), 0);
      const loginUser = { ...findUser._doc, winAmount, lossAmount };
      return sendResponse(
        res,
        StatusCodes.OK,
        ColourBettingEnum.COLOR_USER_LIST,
        loginUser,
      );
    } catch (error) {
      Logger.error.error(
        'colourBetting.service --> getLoginUserColourBet() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async colourBettingWinnerResult(
    req: Request | any,
    res: Response,
    gameType: string,
    gameId: string,
    period: string,
    periodFor: string,
  ): Promise<any> {
    try {
      const findGame = await this.gameRepository.getSingleGameData({
        _id: gameId,
        is_deleted: 0,
      });

      if (findGame.gameMode == 'Manual') {
        await this.colourBettingRepository.colourBettingDataUpdateMany(
          { gameId, gameType, period, selectedTime: periodFor },
          { status: 'pending' },
        );
        return sendResponse(
          res,
          StatusCodes.OK,
          ColourBettingEnum.WINNER_DECLARE_MANUAL,
          [],
        );
      }

      const checkAlreadyWin =
        await this.colourBettingRepository.getColourBettingData({
          gameId,
          isWin: true,
          period: Number(period),
          selectedTime: periodFor,
          gameType,
          is_deleted: 0,
        });

      if (checkAlreadyWin.length) {
        const winColourName = helperUtil.capitalizeFirstLetter(
          checkAlreadyWin[0].colourName,
        );
        return sendResponse(
          res,
          StatusCodes.OK,
          ColourBettingEnum.COLOR_WINNER + ' ' + winColourName,
          [
            {
              period: checkAlreadyWin[0].period,
              colourName: winColourName,
              totalBetAmount: checkAlreadyWin.reduce(
                (total, data) => Number(total) + Number(data.betAmount),
                0,
              ),
            },
          ],
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.OK,
          ColourBettingEnum.DATA_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'colourBetting.service --> getLoginUserColourBet() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
