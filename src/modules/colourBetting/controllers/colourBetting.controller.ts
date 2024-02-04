import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import Logger from 'src/core/Logger';
import { ColourBettingService } from '../services/colourBetting.service';
import {
  AddColourBettingRequestDto,
  ColourBettingBetResultRequestDto,
} from '../dto/colourBetting.dto';

@Controller('colourBetting')
export class ColourBettingController {
  constructor(private readonly colourBettingService: ColourBettingService) {}

  /**
   * get all employee list
   * @return {Promise<Employee[] | []>} all employee list
   */

  @Post('/create-colour-bet')
  @UsePipes(ValidationPipe)
  public async addColourBet(
    @Req() req: Request,
    @Res() res: Response,
    @Body() addColourBettingRequestDto: AddColourBettingRequestDto,
  ): Promise<any> {
    Logger.access.info('colourBetting.controller --> info of addColourBet()');
    try {
      const addColourBetDetails = await this.colourBettingService.addColourBet(
        req,
        res,
        addColourBettingRequestDto,
      );
      return addColourBetDetails;
    } catch (error) {
      Logger.error.error(
        'colourBetting.controller --> addColourBet() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  // @Post('/check-email')
  // @UsePipes(ValidationPipe)
  // public async checkUserEmail(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() body: CheckUserEmailRequestDto,
  // ): Promise<any> {
  //   Logger.access.info(
  //     'user.controller --> info of checkUserEmail() for login and register users',
  //   );
  //   try {
  //     const checkUserEmailDetails = await this.userService.checkUserEmailData(
  //       req,
  //       res,
  //       body,
  //     );
  //     return checkUserEmailDetails;
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.controller --> checkUserEmail() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/signup-password')
  // @UsePipes(ValidationPipe)
  // public async signupFromEmailPassword(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() body: SignupFromEmailPasswordRequestDto,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of signupFromEmailPassword()');
  //   try {
  //     const singupFromEmailPasswordResponse =
  //       await this.userService.signupFromEmailPasswordDetails(req, res, body);
  //     return singupFromEmailPasswordResponse;
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.controller --> signupFromEmailPassword() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  @Get('/colour-bet-result/:gameType/:type/:gameId/:period')
  @UsePipes(ValidationPipe)
  public async colourBetResult(
    @Req() req: Request,
    @Res() res: Response,
    @Param() colourBettingBetResultRequestDto: ColourBettingBetResultRequestDto,
  ): Promise<any> {
    Logger.access.info(
      'colourBetting.controller --> info of colourBetResult()',
    );
    try {
      const getcolourBettingData =
        await this.colourBettingService.colourBetResult(
          req,
          res,
          colourBettingBetResultRequestDto,
        );
      return getcolourBettingData;
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'colourBetting.controller --> colourBetResult() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-all-color-game-winners/:gameId')
  public async getAllGameWiseWinner(
    @Req() req: Request,
    @Res() res: Response,
    @Param() gameId: string,
  ): Promise<any> {
    Logger.access.info(
      'colourBetting.controller --> info of getAllGameWiseWinner()',
    );
    try {
      const getAllGameWiseWinnerData =
        await this.colourBettingService.getAllGameWiseWinner(req, res, gameId);
      return getAllGameWiseWinnerData;
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'colourBetting.controller --> getAllGameWiseWinner() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-single-color-game-winners/:gameId')
  public async getSingleGameWiseWinner(
    @Req() req: Request,
    @Res() res: Response,
    @Param() gameId: string,
  ): Promise<any> {
    Logger.access.info(
      'colourBetting.controller --> info of getSingleGameWiseWinner()',
    );
    try {
      const getSingleGameWiseWinnerData =
        await this.colourBettingService.getSingleGameWiseWinner(
          req,
          res,
          gameId,
        );
      return getSingleGameWiseWinnerData;
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'colourBetting.controller --> getSingleGameWiseWinner() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-login-user-bet')
  public async getLoginUserColourBet(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info(
      'colourBetting.controller --> info of getLoginUserColourBet()',
    );
    try {
      const getLoginUserColourBetData =
        await this.colourBettingService.getLoginUserColourBet(req, res);
      return getLoginUserColourBetData;
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'colourBetting.controller --> getLoginUserColourBet() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-color-betting-winner/:gameType/:gameId/:period')
  public async colourBettingWinnerResult(
    @Req() req: Request,
    @Res() res: Response,
    @Param() gameType: string,
    @Param() gameId: string,
    @Param() period: string,
    @Query('second') periodFor: string,
  ): Promise<any> {
    Logger.access.info(
      'colourBetting.controller --> info of colourBettingWinnerResult()',
    );
    try {
      const colourBettingWinnerResultData =
        await this.colourBettingService.colourBettingWinnerResult(
          req,
          res,
          gameType,
          gameId,
          period,
          periodFor,
        );
      return colourBettingWinnerResultData;
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'colourBetting.controller --> colourBettingWinnerResult() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
