import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import Logger from 'src/core/Logger';
import CommonRepository from 'src/helpers/commonRepository';
import { sendResponse } from 'src/helpers/commonService';
import { AdminEnum } from '../constants/enums/admin.enum';
import { AdminLoginRequestDto } from '../dto/admin.dto';
import AdminRepository from '../repository/admin.repository';
import { helperUtil } from './../../../helpers/helperUtils';

@Injectable()
export class AdminService extends CommonRepository {
  constructor(private readonly adminRepository: AdminRepository) {
    super();
  }

  public async adminLogin(
    req: Request,
    res: Response,
    adminLoginRequestDto: AdminLoginRequestDto,
  ): Promise<any> {
    try {
      const findAdmin = await this.adminRepository.getSingleAdminData(
        {
          email: adminLoginRequestDto.email,
          is_deleted: 0,
        },
        'role',
      );
      if (findAdmin) {
        findAdmin.isLogin = true;
        await findAdmin.save();
        if (findAdmin.role.Role_type == 'Sub Admin') {
          if (!findAdmin.isActive) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              AdminEnum.DEACTIVATED_USER,
              [],
            );
          }
          await this.adminRepository.adminDataUpdated(
            { _id: findAdmin._id },
            {
              deviceId: adminLoginRequestDto.deviceId,
              ipAddress: adminLoginRequestDto.ipAddress,
              deviceName: adminLoginRequestDto.deviceName,
              latitude: adminLoginRequestDto.latitude,
              longitude: adminLoginRequestDto.longitude,
              address: adminLoginRequestDto.address,
            },
          );
        }
        const comparePassword = await helperUtil.passwordCompare(
          adminLoginRequestDto.password,
          findAdmin.password,
        );
        if (comparePassword) {
          const token = helperUtil.generateAdminToken({
            payload: { admin: { id: findAdmin._id, role: findAdmin.role } },
          });
          return sendResponse(res, StatusCodes.OK, AdminEnum.ADMIN_LOGGED_IN, {
            ...findAdmin._doc,
            token,
          });
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            AdminEnum.PLEASE_USE_VALID_PASSWORD,
            [],
          );
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          AdminEnum.ADMIN_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminLogin() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async adminForgetPassword(
    req: Request,
    res: Response,
    email: string,
  ): Promise<any> {
    try {
      const adminData = await this.adminRepository.getSingleAdminData({
        email: email,
        is_deleted: 0,
      });
      if (adminData) {
        // const otp = generateOtp();
        const otp = 4444;
        // let mailInfo = await ejs.renderFile('src/views/ForgotPassword.ejs', {
        //   otp,
        // });
        const updateOtp = await this.adminRepository.adminDataUpdated(
          { _id: adminData._id },
          { otp },
        );
        // await sendMail(updateOtp.email, 'Forgot Password', mailInfo).then(
        //   (data: number) => {
        //     if (data == 0) {
        //       return sendResponse(
        //         res,
        //         StatusCodes.BAD_REQUEST,
        //         adminData.SOMETHING_WENT_WRONG,
        //         [],
        //       );
        //     } else {
        //       return sendResponse(
        //         res,
        //         StatusCodes.OK,
        //         AdminEnum.RESET_PASSWORD_MAIL,
        //         updateOtp,
        //       );
        //     }
        //   },
        // );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          AdminEnum.ACCOUNT_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminForgetPassword() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async adminVerifyOtp(
    req: Request,
    res: Response,
    id: string,
    otp: string,
  ): Promise<any> {
    try {
      const admin = await this.adminRepository.getSingleAdminData({
        _id: id,
        is_deleted: 0,
      });
      if (admin) {
        if (admin?.otp == otp) {
          admin.otp = null;
          await admin.save();
          const updateAdmin = await this.adminRepository.adminDataUpdated(
            { _id: admin._id },
            { resetPasswordAllow: true, otp: null },
          );
          return sendResponse(
            res,
            StatusCodes.OK,
            AdminEnum.VERIFICATION_COMPLETED,
            updateAdmin,
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            AdminEnum.INVALID_OTP,
            [],
          );
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          AdminEnum.ADMIN_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminVerifyOtp() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async adminResendOtp(
    req: Request,
    res: Response,
    adminId: string,
  ): Promise<any> {
    try {
      const otp = 4444;
      // const otp = generateOtp();
      const findAdmin = await this.adminRepository.getSingleAdminData({
        _id: adminId,
        is_deleted: 0,
      });
      if (findAdmin) {
        const updateOtp = await this.adminRepository.adminDataUpdated(
          { _id: adminId },
          { otp },
        );
        // let mailInfo = await ejs.renderFile('src/views/VerifyOtp.ejs', { otp });
        // await sendMail(findAdmin.email, 'Verify Otp', mailInfo);
        return sendResponse(res, StatusCodes.OK, AdminEnum.OTP_RESEND, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          AdminEnum.USER_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminResendOtp() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async adminResetPassword(
    req: Request,
    res: Response,
    adminId: string,
    password: string,
  ): Promise<any> {
    try {
      const otp = 4444;
      // const otp = generateOtp();
      const admin = await this.adminRepository.getSingleAdminData({
        _id: adminId,
        is_deleted: 0,
      });

      if (!admin) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          AdminEnum.ADMIN_NOT_EXIST,
          [],
        );
      }
      if (!admin.resetPasswordAllow) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          AdminEnum.OTP_NOT_VERIFY,
          [],
        );
      }
      const matchOldPassword = await helperUtil.passwordCompare(
        password,
        admin.password,
      );
      if (matchOldPassword) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          AdminEnum.OLD_PASSWORD_SAME,
          [],
        );
      }
      const encryptPassword = await helperUtil.hashedPassword(password);
      const updateAdmin = await this.adminRepository.adminDataUpdated(
        { _id: admin._id },
        { password: encryptPassword, resetPasswordAllow: false },
      );
      if (updateAdmin) {
        return sendResponse(
          res,
          StatusCodes.OK,
          AdminEnum.RESET_PASSWORD,
          updateAdmin,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          AdminEnum.SOMETHING_WENT_WRONG,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminResetPassword() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async adminChangePassword(
    req: Request | any,
    res: Response,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const admin = await this.adminRepository.getSingleAdminData({
        _id: req.admin,
        is_deleted: 0,
      });

      if (admin) {
        const comparePassword = await helperUtil.passwordCompare(
          oldPassword,
          admin.password,
        );
        if (comparePassword) {
          admin.password = await helperUtil.hashedPassword(newPassword);
          admin.resetPassword = true;
          await admin.save();
          return sendResponse(
            res,
            StatusCodes.OK,
            AdminEnum.PASSWORD_CHANGED,
            admin,
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            AdminEnum.YOU_ENTER_WRONG_PASSWORD,
            [],
          );
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          AdminEnum.ADMIN_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminChangePassword() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getAdminProfile(
    req: Request | any,
    res: Response,
  ): Promise<any> {
    try {
      const findAdmin = await this.adminRepository.getSingleAdminData({
        _id: req.admin,
        is_deleted: 0,
      });
      if (findAdmin) {
        return sendResponse(res, StatusCodes.OK, AdminEnum.DATA_GET, findAdmin);
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          AdminEnum.ADMIN_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> getAdminProfile() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async adminEditProfile(
    req: Request | any,
    res: Response,
    profile: string,
    body: any,
  ): Promise<any> {
    try {
      const findData = await this.adminRepository.getSingleAdminData({
        _id: req.admin,
      });
      if (!findData) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          AdminEnum.ADMIN_NOT_EXIST,
          [],
        );
      }
      profile = req.profileUrl ? req.profileUrl : findData.profile;
      const adminData = await this.adminRepository.adminDataUpdated(
        { _id: req.admin, is_deleted: 0 },
        body,
      );
      if (adminData) {
        return sendResponse(
          res,
          StatusCodes.OK,
          AdminEnum.ADMIN_UPDATED,
          adminData,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          AdminEnum.ADMIN_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminEditProfile() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async adminLogout(req: Request | any, res: Response): Promise<any> {
    try {
      const findAdmin = await this.adminRepository.getSingleAdminData({
        _id: req.admin,
        is_deleted: 0,
      });
      if (findAdmin) {
        await this.adminRepository.adminDataUpdated(
          { _id: req.admin, is_deleted: 0 },
          { isLogin: false },
        );
        return sendResponse(res, StatusCodes.OK, AdminEnum.ADMIN_LOGOUT, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          AdminEnum.ADMIN_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminEditProfile() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getUpdatedUser(req: Request | any, res: Response): Promise<any> {
    try {
      const findAdmin = await this.adminRepository.getSingleAdminData(
        { _id: req.admin },
        'role',
      );
      if (findAdmin) {
        return sendResponse(
          res,
          StatusCodes.OK,
          AdminEnum.ADMIN_ROLE,
          findAdmin,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          AdminEnum.ADMIN_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'admin.service --> adminEditProfile() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
