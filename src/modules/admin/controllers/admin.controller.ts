import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import Logger from 'src/core/Logger';
import { AdminLoginRequestDto } from '../dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * get all employee list
   * @return {Promise<Employee[] | []>} all employee list
   */

  @Post('/login')
  @UsePipes(ValidationPipe)
  public async adminLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() adminLoginRequestDto: AdminLoginRequestDto,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of adminLogin()');
    try {
      const adminLoginData = await this.adminService.adminLogin(
        req,
        res,
        adminLoginRequestDto,
      );
      return adminLoginData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> adminLogin() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  public async adminForgetPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() email: string,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of adminForgetPassword()');
    try {
      const adminForgetPasswordData =
        await this.adminService.adminForgetPassword(req, res, email);
      return adminForgetPasswordData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> adminForgetPassword() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/verify-otp')
  @UsePipes(ValidationPipe)
  public async adminVerifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() id: string,
    @Body() otp: string,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of adminVerifyOtp()');
    try {
      const adminVerifyOtpData = await this.adminService.adminVerifyOtp(
        req,
        res,
        id,
        otp,
      );
      return adminVerifyOtpData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> adminVerifyOtp() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/resend-otp')
  @UsePipes(ValidationPipe)
  public async adminResendOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() adminId: string,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of adminResendOtp()');
    try {
      const adminResendOtpData = await this.adminService.adminResendOtp(
        req,
        res,
        adminId,
      );
      return adminResendOtpData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> adminResendOtp() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/reset-password')
  @UsePipes(ValidationPipe)
  public async adminResetPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() adminId: string,
    @Body() password: string,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of adminResetPassword()');
    try {
      const adminResetPasswordData = await this.adminService.adminResetPassword(
        req,
        res,
        adminId,
        password,
      );
      return adminResetPasswordData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> adminResetPassword() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/change-password')
  @UsePipes(ValidationPipe)
  public async adminChangePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() oldPassword: string,
    @Body() newPassword: string,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of adminChangePassword()');
    try {
      const adminChangePasswordData =
        await this.adminService.adminChangePassword(
          req,
          res,
          oldPassword,
          newPassword,
        );
      return adminChangePasswordData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> adminChangePassword() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/profile')
  @UsePipes(ValidationPipe)
  public async getAdminProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of getAdminProfile()');
    try {
      const getAdminProfileData = await this.adminService.getAdminProfile(
        req,
        res,
      );
      return getAdminProfileData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> getAdminProfile() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/profile-update')
  @UsePipes(ValidationPipe)
  public async adminEditProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() profile: string,
    @Body() body: any,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of adminEditProfile()');
    try {
      const adminEditProfileData = await this.adminService.adminEditProfile(
        req,
        res,
        profile,
        body,
      );
      return adminEditProfileData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> adminEditProfile() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/logout')
  @UsePipes(ValidationPipe)
  public async adminLogout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of adminLogout()');
    try {
      const adminLogoutData = await this.adminService.adminLogout(req, res);
      return adminLogoutData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> adminLogout() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-role-admin')
  @UsePipes(ValidationPipe)
  public async getUpdatedUser(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info('admin.controller --> info of getUpdatedUser()');
    try {
      const getUpdatedUserData = await this.adminService.getUpdatedUser(
        req,
        res,
      );
      return getUpdatedUserData;
    } catch (error) {
      Logger.error.error(
        'admin.controller --> getUpdatedUser() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
