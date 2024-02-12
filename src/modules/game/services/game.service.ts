import { BadRequestException, Injectable } from '@nestjs/common';
import CommonRepository from 'src/helpers/commonRepository';
import GameRepository from '../repository/game.repository';
import Logger from 'src/core/Logger';
import { sendResponse } from 'src/helpers/commonService';
import { StatusCodes } from 'http-status-codes';
import { GameEnum } from '../constants/enums/game.enum';

@Injectable()
export class GameService extends CommonRepository {
  constructor(private readonly gameRepository: GameRepository) {
    super();
  }
  public async userGetAllGame(req: Request, res: Response): Promise<any> {
    try {
      const games = await this.gameRepository.getGamesData({ is_deleted: 0 });
      if (games.length) {
        const newGames = games.map(async (game: any) => {
          // const ratings = await Rating.find({ gameId: game._id });
          // let ratingAverage;
          // if (ratings.length) {
          //   ratingAverage =
          //     ratings.reduce(
          //       (sum: any, ratingData: any) => sum + ratingData.rating,
          //       0,
          //     ) / ratings.length;
          // } else {
          //   ratingAverage = 0;
          // }
          return { ...game._doc };
        });
        const data = await Promise.all(newGames);
        return sendResponse(res, StatusCodes.OK, GameEnum.GAME_GET_ALL, data);
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          GameEnum.GAME_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'game.service --> userGetAllGame() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async getSingleGameRules(
    req: Request | any,
    res: Response,
    gameId: any,
  ): Promise<any> {
    try {
      if (req.admin || req.user) {
        // const { gameId } = req.params;
        const findGameRule = await this.gameRepository.getSingleGameRulesData({
          gameId,
        });
        if (findGameRule) {
          return sendResponse(
            res,
            StatusCodes.OK,
            GameEnum.GAME_RULES_GET,
            findGameRule,
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.NOT_FOUND,
            GameEnum.GAME_RULES_NOT_FOUND,
            [],
          );
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          GameEnum.UNAUTHORIZED,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'game.service --> getSingleGameRules() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async getSingleGameTime(
    req: Request | any,
    res: Response,
    gameId: any,
  ): Promise<any> {
    try {
      const getGameTime = await this.gameRepository.getSingleGameTimeData({
        gameId,
        is_deleted: 0,
      });
      if (getGameTime) {
        return sendResponse(
          res,
          StatusCodes.OK,
          GameEnum.GAME_TIME_GET,
          getGameTime,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          GameEnum.GAME_TIME_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'game.service --> getSingleGameTime() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
