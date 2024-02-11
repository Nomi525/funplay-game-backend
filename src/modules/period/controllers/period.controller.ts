import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { PeriodService } from '../services/period.service';
import Logger from 'src/core/Logger';

@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  /**
   * get all employee list
   * @return {Promise<Employee[] | []>} all employee list
   */

  // @Post('/create-colour-bet')
  // @UsePipes(ValidationPipe)
  // public async addColourBet(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() addColourBettingRequestDto: AddColourBettingRequestDto,
  // ): Promise<any> {
  //   Logger.access.info('colourBetting.controller --> info of addColourBet()');
  //   try {
  //     const addColourBetDetails = await this.colourBettingService.addColourBet(
  //       req,
  //       res,
  //       addColourBettingRequestDto,
  //     );
  //     return addColourBetDetails;
  //   } catch (error) {
  //     Logger.error.error(
  //       'colourBetting.controller --> addColourBet() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

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

  // @Get('/colour-bet-result/:gameType/:type/:gameId/:period')
  // @UsePipes(ValidationPipe)
  // public async colourBetResult(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param() colourBettingBetResultRequestDto: ColourBettingBetResultRequestDto,
  // ): Promise<any> {
  //   Logger.access.info(
  //     'colourBetting.controller --> info of colourBetResult()',
  //   );
  //   try {
  //     const getcolourBettingData =
  //       await this.colourBettingService.colourBetResult(
  //         req,
  //         res,
  //         colourBettingBetResultRequestDto,
  //       );
  //     return getcolourBettingData;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'colourBetting.controller --> colourBetResult() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Get('/get-periods-details-all-game')
  // public async getPeriodsDetailsForAllGame(
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ): Promise<any> {
  //   Logger.access.info(
  //     'period.controller --> info of getPeriodsDetailsForAllGame()',
  //   );
  //   try {
  //     const getPeriodsDetailsForAllGameData =
  //       await this.periodService.getPeriodsDetailsForAllGame(req, res);
  //     return getPeriodsDetailsForAllGameData;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'period.controller --> getPeriodsDetailsForAllGame() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Get('/get-all-periods-game-wise/:gameType/:gameId')
  // public async getAllGameRecodesGameWise(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param() gameId: any,
  //   @Param() gameType: any,
  // ): Promise<any> {
  //   Logger.access.info(
  //     'period.controller --> info of getAllGameRecodesGameWise()',
  //   );
  //   try {
  //     const getAllGameRecodesGameWiseData =
  //       await this.periodService.getAllGameRecodesGameWise(
  //         req,
  //         res,
  //         gameId,
  //         gameType,
  //       );
  //     return getAllGameRecodesGameWiseData;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'period.controller --> getAllGameRecodesGameWise() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/verify-otp')
  // @UsePipes(ValidationPipe)
  // public async verifyUserOtp(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() body: VerifyUserOtpRequestDto,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of verifyUserOtp()');
  //   try {
  //     const setVerifyOtp = await this.userService.setUserVerifyOtp(
  //       req,
  //       res,
  //       body,
  //     );
  //     return setVerifyOtp;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> verifyUserOtp() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/resend-otp')
  // @UsePipes(ValidationPipe)
  // public async resendUserOtp(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() userId: string,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of resendUserOtp()');
  //   try {
  //     const setResendUserOtp = await this.userService.setUserResendOtp(
  //       req,
  //       res,
  //       userId,
  //     );
  //     return setResendUserOtp;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> resendUserOtp() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/set-password')
  // @UsePipes(ValidationPipe)
  // public async setUserPassword(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() password: string,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of setUserPassword()');
  //   try {
  //     const setUserPassword = await this.userService.setPasswordUser(
  //       req,
  //       res,
  //       password,
  //     );
  //     return setUserPassword;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> setUserPassword() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/signup-signing-with-wallet')
  // @UsePipes(ValidationPipe)
  // public async connectToWallet(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() connectToWalletUserRequestDto: ConnectToWalletUserRequestDto,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of connectToWallet()');
  //   try {
  //     const setUserConnectToWallet = await this.userService.connectToUserWallet(
  //       req,
  //       res,
  //       connectToWalletUserRequestDto,
  //     );
  //     return setUserConnectToWallet;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> connectToWallet() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/check-wallet-connectivity')
  // @UsePipes(ValidationPipe)
  // public async checkWalletAddress(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() checkWalletAddressUserRequestDto: CheckWalletAddressUserRequestDto,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of checkWalletAddress()');
  //   try {
  //     const checkAndSetWalletAddress =
  //       await this.userService.checkUserWalletAddress(
  //         req,
  //         res,
  //         checkWalletAddressUserRequestDto,
  //       );
  //     return checkAndSetWalletAddress;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> checkWalletAddress() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/signing-wallet')
  // @UsePipes(ValidationPipe)
  // public async singInWalletAddress(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body()
  //   singInWalletAddressUserRequestDto: SingInWalletAddressUserRequestDto,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of singInWalletAddress()');
  //   try {
  //     const singInWalletAddressUser =
  //       await this.userService.singInUserWalletAddress(
  //         req,
  //         res,
  //         singInWalletAddressUserRequestDto,
  //       );
  //     return singInWalletAddressUser;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> singInWalletAddress() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/forgot-password')
  // @UsePipes(ValidationPipe)
  // public async forgotPassword(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() email: string,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of forgotPassword()');
  //   try {
  //     const forgotUserPassword = await this.userService.forgotUserPassword(
  //       req,
  //       res,
  //       email,
  //     );
  //     return forgotUserPassword;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> forgotPassword() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/reset-password')
  // @UsePipes(ValidationPipe)
  // public async resetPassword(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() userId: string,
  //   @Body() password: string,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of resetPassword()');
  //   try {
  //     const resetUserPassword = await this.userService.resetUserPassword(
  //       req,
  //       res,
  //       userId,
  //       password,
  //     );
  //     return resetUserPassword;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> resetPassword() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/verify-forgot-otp')
  // @UsePipes(ValidationPipe)
  // public async verifyForgotOtp(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() verifyForgotOtpUserRequestDto: VerifyForgotOtpUserRequestDto,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of verifyForgotOtp()');
  //   try {
  //     const verifyUserForgotOtp = await this.userService.verifyUserForgotOtp(
  //       req,
  //       res,
  //       verifyForgotOtpUserRequestDto,
  //     );
  //     return verifyUserForgotOtp;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> verifyForgotOtp() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/profile-update')
  // @UsePipes(ValidationPipe)
  // public async editProfile(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() editProfileUserRequestDto: EditProfileUserRequestDto,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of editProfile()');
  //   try {
  //     const updateUserProfile = await this.userService.updateUserProfile(
  //       req,
  //       res,
  //       editProfileUserRequestDto,
  //     );
  //     return updateUserProfile;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> editProfile() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/change-password')
  // @UsePipes(ValidationPipe)
  // public async changePassword(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() oldPassword: string,
  //   @Body() newPassword: string,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of changePassword()');
  //   try {
  //     const changeUserPassword = await this.userService.changeUserPassword(
  //       req,
  //       res,
  //       oldPassword,
  //       newPassword,
  //     );
  //     return changeUserPassword;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> changePassword() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/logout')
  // @UsePipes(ValidationPipe)
  // public async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
  //   Logger.access.info('user.controller --> info of logout()');
  //   try {
  //     const userLogout = await this.userService.userLogout(req, res);
  //     return userLogout;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> logout() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/userEdit')
  // @UsePipes(ValidationPipe)
  // public async userEditProfile(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() fullName: string,
  //   @Body() mobileNumber: string,
  //   @Body() email: string,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of userEditProfile()');
  //   try {
  //     const editUserProfile = await this.userService.editUserProfile(
  //       req,
  //       res,
  //       fullName,
  //       mobileNumber,
  //       email,
  //     );
  //     return editUserProfile;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> userEditProfile() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Post('/accountDeactivate')
  // @UsePipes(ValidationPipe)
  // public async accountDeactivate(
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of accountDeactivate()');
  //   try {
  //     const userAccountDeactivate =
  //       await this.userService.userAccountDeactivate(req, res);
  //     return userAccountDeactivate;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> accountDeactivate() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @Get('/verify-email')
  // public async emailVerify(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Query() key: string,
  // ): Promise<any> {
  //   Logger.access.info('user.controller --> info of accountDeactivate()');
  //   try {
  //     const userEmailVerify = await this.userService.userEmailVerify(
  //       req,
  //       res,
  //       key,
  //     );
  //     return userEmailVerify;
  //   } catch (error) {
  //     console.log({ error });
  //     Logger.error.error(
  //       'user.controller --> accountDeactivate() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
