import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from '../services/game.service';
import Logger from 'src/core/Logger';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /**
   * get all employee list
   * @return {Promise<Employee[] | []>} all employee list
   */

  @Get('/games')
  public async userGetAllGame(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info('game.controller --> info of userGetAllGame()');
    try {
      const userGetAllGameData = await this.gameService.userGetAllGame(
        req,
        res,
      );
      return userGetAllGameData;
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'game.controller --> userGetAllGame() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-single-game-rule/:gameId')
  public async getSingleGameRule(
    @Req() req: Request,
    @Res() res: Response,
    @Param() gameId: any,
  ): Promise<any> {
    Logger.access.info('game.controller --> info of getSingleGameRule()');
    try {
      const getSingleGameRuleData = await this.gameService.getSingleGameRules(
        req,
        res,
        gameId,
      );
      return getSingleGameRuleData;
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'game.controller --> getSingleGameRule() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-single-game-time/:gameId')
  public async getSingleGameTime(
    @Req() req: Request,
    @Res() res: Response,
    @Param() gameId: any,
  ): Promise<any> {
    Logger.access.info('game.controller --> info of getSingleGameTime()');
    try {
      const getSingleGameTimeData = await this.gameService.getSingleGameTime(
        req,
        res,
        gameId,
      );
      return getSingleGameTimeData;
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'game.controller --> getSingleGameTime() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
