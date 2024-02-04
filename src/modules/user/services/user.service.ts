import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import Logger from 'src/core/Logger';
import CommonRepository from 'src/helpers/commonRepository';
import { sendResponse } from 'src/helpers/commonService';
import { helperUtil } from 'src/helpers/helperUtils';
import ReferralUserRepository from 'src/modules/referralUser/repository/referralUser.repository';
import RewardUserRepository from 'src/modules/rewardUser/repository/rewardUser.repository';
import { RewardUserService } from 'src/modules/rewardUser/services/rewardUser.service';
import CurrencyCoinRepository from 'src/modules/transaction/repository/currencyCoin.repository';
import TransactionHistoryRepository from 'src/modules/transaction/repository/transactionHistory.repository';
import { userEnum } from '../constants/enums/user.enum';
import {
  CheckUserEmailRequestDto,
  CheckWalletAddressUserRequestDto,
  ConnectToWalletUserRequestDto,
  EditProfileUserRequestDto,
  SingupFromEmailPasswordRequestDto as SignupFromEmailPasswordRequestDto,
  SingInWalletAddressUserRequestDto,
  UserSignUpSignInOtpRequestDto,
  UserSignUpSignInOtpResponseDto,
  VerifyForgotOtpUserRequestDto,
  VerifyUserOtpRequestDto,
} from '../dto/user.dto';
import UserRepository from '../repository/user.repository';
import ColourBettingRepository from 'src/modules/colourBetting/repository/colourBetting.repository';

@Injectable()
export class UserService extends CommonRepository {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly referralUserRepository: ReferralUserRepository,
    private readonly rewardUserRepository: RewardUserRepository,
    private readonly rewardUserService: RewardUserService,
    // private readonly transactionRepository: TransactionRepository,
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly currencyCoinRepository: CurrencyCoinRepository,
    private readonly colourBettingRepository: ColourBettingRepository,
  ) {
    super();
  }

  public async signupSigningOTP(
    req: Request,
    res: Response,
    userSignUpSignInOtpRequestDto: UserSignUpSignInOtpRequestDto,
  ): Promise<UserSignUpSignInOtpResponseDto | []> {
    try {
      let existingUser: any;
      let updateOtp: any;
      let userData: any;
      let message: string;

      const OTP = 4444;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailRegex.test(userSignUpSignInOtpRequestDto.email);

      console.log({ isEmailValid });

      if (isEmailValid) {
        userSignUpSignInOtpRequestDto.email =
          userSignUpSignInOtpRequestDto.email.toLowerCase();

        console.log(userSignUpSignInOtpRequestDto.email);

        existingUser = await this.userRepository.getSingleUserData({
          email: userSignUpSignInOtpRequestDto.email,
        });
      } else {
        existingUser = await this.userRepository.getSingleUserData({
          mobileNumber: userSignUpSignInOtpRequestDto.email,
        });
      }

      console.log({ existingUser });

      if (existingUser) {
        if (existingUser.is_deleted !== 0 || !existingUser.isActive) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.DEACTIVATED_USER,
            [],
          );
        }
        if (!existingUser.currency) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.USER_ALREADY_EXIST,
            [],
          );
        }

        if (isEmailValid) {
          updateOtp = await this.userRepository.userDataUpdated(
            { email: userSignUpSignInOtpRequestDto.email },
            { otp: OTP, currency: userSignUpSignInOtpRequestDto.currency },
          );

          // let mailInfo = await ejs.renderFile('src/views/VerifyOtp.ejs', {
          //   otp: OTP,
          // });

          message = userEnum.ALREADY_REGISTER_VERIFY_EMAIL;

          // await sendMail(
          //   userSignUpSignInOtpRequestDto.email,
          //   'Verify Otp',
          //   mailInfo,
          // );
        } else {
          updateOtp = await this.userRepository.userDataUpdated(
            { mobileNumber: userSignUpSignInOtpRequestDto.email },
            { otp: OTP, currency: userSignUpSignInOtpRequestDto.currency },
          );
          message = userEnum.ALREADY_REGISTER_VERIFY_MOBILE;
        }

        return sendResponse(res, StatusCodes.OK, message, updateOtp);
      } else {
        if (!userSignUpSignInOtpRequestDto.currency) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.USER_NOT_EXIST,
            [],
          );
        }

        const referCode = helperUtil.referralCode(8);

        let findReferralUser = null;

        if (userSignUpSignInOtpRequestDto.referralByCode) {
          findReferralUser = await this.userRepository.getReferralUserData(
            findReferralUser,
          );

          if (!findReferralUser) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.REFERRAL_CODE_NOT_FOUND,
              [],
            );
          }
        }

        userData = await this.userRepository.userDataCreate({
          fullName: userSignUpSignInOtpRequestDto.fullName,
          email: isEmailValid ? userSignUpSignInOtpRequestDto.email : '',
          mobileNumber: !isEmailValid
            ? userSignUpSignInOtpRequestDto.email
            : '',
          currency: userSignUpSignInOtpRequestDto.currency,
          otp: OTP,
          referralCode: referCode,
          registerType: userSignUpSignInOtpRequestDto.registerType,
          referralByCode: userSignUpSignInOtpRequestDto.referralByCode ?? null,
        });

        if (findReferralUser) {
          await this.referralUserRepository.createUserReferral({
            userId: findReferralUser._id,
            referralUser: userData._id,
            referralByCode: userSignUpSignInOtpRequestDto.referralByCode,
          });
        }

        if (userData) {
          await this.rewardUserService.addUserReward({
            userId: userData._id,
            title: 'Created Reward',
            description: 'First time reward from admin side',
          });
        }

        message = userEnum.USER_CREATE_SENT_OTP_ON_YOUR_MOBILE;
        if (isEmailValid) {
          message = userEnum.USER_CREATE_SENT_OTP_ON_YOUR_EMAIL;
        }
      }
      return sendResponse(res, StatusCodes.CREATED, message, userData);
    } catch (error) {
      Logger.error.error(
        'user.service --> signupSigninOTP() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async checkUserEmailData(
    req: Request,
    res: Response,
    checkUserEmailRequestDto: CheckUserEmailRequestDto,
  ): Promise<any> {
    try {
      checkUserEmailRequestDto.email = checkUserEmailRequestDto.email
        ? checkUserEmailRequestDto.email.toLowerCase()
        : null;

      const existingUser = await this.userRepository.getSingleUserData({
        email: checkUserEmailRequestDto.email,
      });

      if (existingUser) {
        if (checkUserEmailRequestDto.type == 'signup') {
          if (
            checkUserEmailRequestDto.registerType == 'Password' ||
            checkUserEmailRequestDto.registerType == 'OTP'
          ) {
            if (existingUser?.registerType == 'Password') {
              return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                userEnum.USER_ALREADY_EXIST,
                [],
              );
            }
            if (existingUser?.isVerified) {
              return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                userEnum.USER_ALREADY_EXIST,
                [],
              );
            }
            if (
              existingUser &&
              checkUserEmailRequestDto.registerType == 'Password' &&
              existingUser?.isVerified
            ) {
              return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                userEnum.USER_ALREADY_EXIST,
                [],
              );
            }
          }
        }

        if (checkUserEmailRequestDto.type == 'login') {
          if (!existingUser.isActive || existingUser.is_deleted == 1) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.DEACTIVATED_USER,
              [],
            );
          }
          if (
            existingUser.registerType == 'OTP' &&
            existingUser.password == null &&
            existingUser.isVerified
          ) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.PASSWORD_NOT_SET,
              [],
            );
          }

          if (
            existingUser.registerType == 'OTP' &&
            existingUser.password == null &&
            !existingUser.isVerified
          ) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.USER_NOT_EXIST,
              [],
            );
          }

          if (
            existingUser.registerType == 'Password' &&
            existingUser.password == null
          ) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.USER_NOT_EXIST,
              [],
            );
          }
        }
        return sendResponse(
          res,
          StatusCodes.OK,
          userEnum.DATA_GET,
          existingUser,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          userEnum.USER_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> checkUserEmailData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getUserProfile(req: Request | any, res: Response): Promise<any> {
    try {
      const findUser = await this.userRepository.getSingleUserData({
        _id: req.user,
        is_deleted: 0,
      });
      if (findUser) {
        return sendResponse(
          res,
          StatusCodes.OK,
          userEnum.SINGLE_USER,
          findUser,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          userEnum.USER_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> getUserProfile() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async userDashboard(req: Request | any, res: Response): Promise<any> {
    try {
      const findUser = await this.userRepository.getSingleUserData({
        _id: req.user,
        is_deleted: 0,
      });
      if (findUser) {
        const today = new Date();

        // For User Get bit of 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        // const numberBettingForUser = await NumberBetting.find({
        //   userId: findUser._id,
        //   createdAt: { $gte: twentyFourHoursAgo },
        //   is_deleted: 0,
        // });
        const colourBettingForUser =
          await this.colourBettingRepository.getColourBettingData({
            userId: findUser._id,
            createdAt: { $gte: twentyFourHoursAgo },
            is_deleted: 0,
          });
        // const communityBettingForUser = await CommunityBetting.find({
        //   userId: findUser._id,
        //   createdAt: { $gte: twentyFourHoursAgo },
        //   is_deleted: 0,
        // });
        // const penaltyBettingForUser = await PenaltyBetting.find({
        //   userId: findUser._id,
        //   createdAt: { $gte: twentyFourHoursAgo },
        //   is_deleted: 0,
        // });
        // const cardBettingForUser = await CardBetting.find({
        //   userId: findUser._id,
        //   createdAt: { $gte: twentyFourHoursAgo },
        //   is_deleted: 0,
        // });
        // const totalUserswhoPlacedBidsin24Hrs =
        //   numberBettingForUser.length +
        //   colourBettingForUser.length +
        //   communityBettingForUser.length +
        //   penaltyBettingForUser.length +
        //   cardBettingForUser.length;

        const totalUserswhoPlacedBidsin24Hrs = colourBettingForUser.length;

        // const totalUserswhoPlacedBidsin24Hrs = await getAllBids({ userId: findUser._id, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })

        // For All Get bit of 24 hours
        // const numberBetting = await NumberBetting.find({
        //   createdAt: { $gte: twentyFourHoursAgo },
        //   is_deleted: 0,
        // });
        const colourBetting =
          await this.colourBettingRepository.getColourBettingData({
            createdAt: { $gte: twentyFourHoursAgo },
            is_deleted: 0,
          });
        // const communityBetting = await CommunityBetting.find({
        //   createdAt: { $gte: twentyFourHoursAgo },
        //   is_deleted: 0,
        // });
        // const penaltyBetting = await PenaltyBetting.find({
        //   createdAt: { $gte: twentyFourHoursAgo },
        //   is_deleted: 0,
        // });
        // const cardBetting = await CardBetting.find({
        //   createdAt: { $gte: twentyFourHoursAgo },
        //   is_deleted: 0,
        // });
        // const totalBidin24Hrs =
        //   numberBetting.length +
        //   colourBetting.length +
        //   communityBetting.length +
        //   penaltyBetting.length +
        //   cardBetting.length;

        const totalBidin24Hrs = colourBetting.length;
        // const totalBidin24Hrs = await getAllBids({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })

        // For Total winning amount in 24 hours
        // const numberBettingWinningAmount = numberBettingForUser.reduce(
        //   (total: any, data: any) => Number(total) + Number(data.rewardAmount),
        //   0,
        // );
        const colourBettingWinningAmount = colourBettingForUser.reduce(
          (total: any, data: any) => Number(total) + Number(data.rewardAmount),
          0,
        );
        // const communityBettingWinningAmount = communityBettingForUser.reduce(
        //   (total: any, data: any) => Number(total) + Number(data.rewardAmount),
        //   0,
        // );
        // const penaltyBettingWinningAmount = penaltyBettingForUser.reduce(
        //   (total: any, data: any) => Number(total) + Number(data.rewardAmount),
        //   0,
        // );
        // const cardBettingWinningAmount = cardBettingForUser.reduce(
        //   (total: any, data: any) => Number(total) + Number(data.rewardAmount),
        //   0,
        // );
        // const totalWinningAmountin24Hrs =
        //   numberBettingWinningAmount +
        //   colourBettingWinningAmount +
        //   communityBettingWinningAmount +
        //   penaltyBettingWinningAmount +
        //   cardBettingWinningAmount;

        const totalWinningAmountin24Hrs = colourBettingWinningAmount;
        // For Total referral code count
        const totalReferralCount =
          await this.referralUserRepository.countDocuments({
            userId: findUser._id,
          });

        // For All transaction of user
        const transactions =
          await this.transactionHistoryRepository.getAllTransactionHistoryData({
            userId: findUser._id,
            is_deleted: 0,
          });
        const totalTransaction = transactions.length;

        const transactionDeposite =
          await this.transactionHistoryRepository.getSingleTransactionHistoryData(
            { userId: findUser._id, is_deleted: 0 },
          );

        if (!findUser.currency) {
          findUser.currency = 'USD';
          await findUser.save();
        }
        const currency =
          await this.currencyCoinRepository.getSingleCurrencyCoinData({
            currencyName: findUser.currency,
          });
        const coinRate = currency?.coin;

        // One months rewards get
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        const rewardOneMonthQuery = {
          createdAt: {
            $gte: oneMonthAgo,
            $lte: today,
          },
        };

        // One Week Reward
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        const rewardOneWeekQuery = {
          createdAt: {
            $gte: oneWeekAgo,
            $lte: today,
          },
        };

        // Today Rewas count get
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const rewardTodayQuery = {
          createdAt: {
            $gte: today,
            $lte: endOfDay,
          },
        };

        // All Reward Data Code 24 hours
        // const totalNumberBettingReward = numberBetting.reduce(
        //   (total: any, data: any) => Number(total) + Number(data.rewardAmount),
        //   0,
        // );
        const totalColourBettingReward = colourBetting.reduce(
          (total: any, data: any) => Number(total) + Number(data.rewardAmount),
          0,
        );
        // const totalCommunityBettingReward = communityBetting.reduce(
        //   (total: any, data: any) => Number(total) + Number(data.rewardAmount),
        //   0,
        // );
        // const totalPenaltyBettingReward = penaltyBetting.reduce(
        //   (total: any, data: any) => Number(total) + Number(data.rewardAmount),
        //   0,
        // );
        // const totalCardBettingReward = cardBetting.reduce(
        //   (total: any, data: any) => Number(total) + Number(data.rewardAmount),
        //   0,
        // );
        // const totalReward =
        //   totalNumberBettingReward +
        //   totalColourBettingReward +
        //   totalCommunityBettingReward +
        //   totalPenaltyBettingReward +
        //   totalCardBettingReward;

        const totalReward = totalColourBettingReward;

        // One month Reward Code
        const totalRewardsDistributedToday =
          await this.rewardUserRepository.countDocuments({
            userId: findUser._id,
            is_deleted: 0,
            ...rewardTodayQuery,
          });
        const totalWithdrawal = transactions.filter(
          (tran: any) => tran.type == 'withdrawal',
        );
        const totalDeposit = transactions.filter(
          (tran: any) => tran.type == 'deposit',
        );

        // One Day Reward
        // const totalOneDayNumberReward = await calculateTotalReward(NumberBetting, rewardTodayQuery);
        // const totalOneDayColourReward = await calculateTotalReward(ColourBetting, rewardTodayQuery);
        // const totalOneDayCommunityReward = await calculateTotalReward(CommunityBetting, rewardTodayQuery);
        // const totalOneDayPenaltyReward = await calculateTotalReward(PenaltyBetting, rewardTodayQuery);
        // const totalOneDayCardReward = await calculateTotalReward(CardBetting, rewardTodayQuery);
        // const totalOneDayReward = totalOneDayNumberReward + totalOneDayColourReward + totalOneDayCommunityReward + totalOneDayPenaltyReward + totalOneDayCardReward;
        const totalOneDayReward = await helperUtil.calculateAllGameReward(
          rewardTodayQuery,
        );

        // One Month Reward
        // const totalOneMonthNumberReward = await calculateTotalReward(NumberBetting, rewardOneMonthQuery);
        // const totalOneMonthColourReward = await calculateTotalReward(ColourBetting, rewardOneMonthQuery);
        // const totalOneMonthCommunityReward = await calculateTotalReward(CommunityBetting, rewardOneMonthQuery);
        // const totalOneMonthPenaltyReward = await calculateTotalReward(PenaltyBetting, rewardOneMonthQuery);
        // const totalOneMonthCardReward = await calculateTotalReward(CardBetting, rewardOneMonthQuery);
        // const totalOneMonthReward = totalOneMonthNumberReward + totalOneMonthColourReward + totalOneMonthCommunityReward + totalOneMonthPenaltyReward + totalOneMonthCardReward;
        const totalOneMonthReward = await helperUtil.calculateAllGameReward(
          rewardOneMonthQuery,
        );

        // const totalOneWeekNumberReward = await calculateTotalReward(NumberBetting, rewardOneWeekQuery);
        // const totalOneWeekColourReward = await calculateTotalReward(ColourBetting, rewardOneWeekQuery);
        // const totalOneWeekCommunityReward = await calculateTotalReward(CommunityBetting, rewardOneWeekQuery);
        // const totalOneWeekPenaltyReward = await calculateTotalReward(PenaltyBetting, rewardOneWeekQuery);
        // const totalOneWeekCardReward = await calculateTotalReward(CardBetting, rewardOneWeekQuery);
        // const totalOneWeekReward = totalOneWeekNumberReward + totalOneWeekColourReward + totalOneWeekCommunityReward + totalOneWeekPenaltyReward + totalOneWeekCardReward;
        const totalOneWeekReward = await helperUtil.calculateAllGameReward(
          rewardOneWeekQuery,
        );

        const totalRewardsDistributedOneMonth =
          await this.rewardUserRepository.countDocuments({
            userId: findUser._id,
            is_deleted: 0,
            ...rewardOneMonthQuery,
          });

        let totalBalance = 0;
        let totalDepositeBalance = 0;
        const remainingBalance = 0;
        const totalDepositAmount = totalDeposit.reduce(
          (total: any, data: any) =>
            helperUtil.plusLargeSmallValue(total, data.tokenDollorValue),
          0,
        );
        const totalWithdrawalAmount = totalWithdrawal.reduce(
          (total: any, data: any) =>
            helperUtil.plusLargeSmallValue(total, data.tokenDollorValue),
          0,
        );
        if (
          transactionDeposite &&
          parseFloat(transactionDeposite.betAmount) > 0
        ) {
          totalBalance = transactionDeposite.tokenDollorValue;
          totalDepositeBalance = transactionDeposite.betAmount;
          // totalBalance = await plusLargeSmallValue(transactionDeposite.tokenDollorValue, transactionDeposite.betAmount);
          // remainingBalance = transactionDeposite.tokenDollorValue
          // totalDeposit = transactions.filter(tran => tran.type == "withdrawal")
        }
        const totalCoin = transactionDeposite
          ? transactionDeposite.totalCoin
          : 0;
        const convertedCoin = transactionDeposite
          ? transactionDeposite.totalCoin / coinRate
          : 0;
        // console.log(totalDepositAmount,totalWithdrawalAmount);
        return sendResponse(res, StatusCodes.OK, userEnum.DASHBOARD_DATA_GET, {
          totalUserswhoPlacedBidsin24Hrs,
          totalBidin24Hrs,
          totalWinningAmountin24Hrs,
          totalReferralCount,
          totalTransaction,
          // totalRewardsDistributedOneMonth,
          // totalRewardsDistributedToday,
          totalOneDayReward,
          totalOneWeekReward,
          totalOneMonthReward,
          totalWithdrawalRequests: totalWithdrawal.length,
          totalBalance: transactionDeposite
            ? transactionDeposite.tokenDollorValue
            : 0,
          totalCoin: totalCoin,
          currency: findUser ? findUser.currency : 'USD',
          convertedCoin: convertedCoin,
          // remainingBalance,
          // totalDepositeBalance,
          totalDepositAmount: helperUtil.minusLargeSmallValue(
            totalDepositAmount,
            totalWithdrawalAmount,
          ),
          totalReward,
          walletDetails: findUser.wallet,
        });
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.USER_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> userDashboard() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async signupFromEmailPasswordDetails(
    req: Request,
    res: Response,
    signupFromEmailPasswordRequestDto: SignupFromEmailPasswordRequestDto,
  ): Promise<any> {
    try {
      let userFind: any;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmailValue = emailRegex.test(
        signupFromEmailPasswordRequestDto.email,
      );
      if (checkEmailValue) {
        signupFromEmailPasswordRequestDto.email =
          signupFromEmailPasswordRequestDto.email
            ? signupFromEmailPasswordRequestDto.email.toLowerCase()
            : null;
      }

      if (checkEmailValue) {
        userFind = await this.userRepository.getSingleUserData({
          email: signupFromEmailPasswordRequestDto.email,
        });
      } else {
        userFind = await this.userRepository.getSingleUserData({
          mobileNumber: signupFromEmailPasswordRequestDto.email,
        });
      }

      if (signupFromEmailPasswordRequestDto.type == 'login') {
        if (userFind) {
          if (userFind.is_deleted != 0) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.DEACTIVATED_USER,
              [],
            );
          }
          if (!userFind.isActive) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.DEACTIVATED_USER,
              [],
            );
          }
          if (userFind.password == null) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.REGISTERED_TYPE_NOT_MATCH_FOR_PASSWORD,
              [],
            );
          }
          const verifyPassword = await helperUtil.passwordCompare(
            signupFromEmailPasswordRequestDto.password,
            userFind.password,
          );

          console.log({ verifyPassword });

          if (verifyPassword) {
            const payload = {
              user: {
                id: userFind._id,
              },
            };
            userFind.isLogin = true;
            await userFind.save();
            const token = helperUtil.generateToken({ payload });
            return sendResponse(res, StatusCodes.OK, userEnum.LOGIN, {
              ...userFind._doc,
              token,
            });
          } else {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.INVALID_PASSWORD,
              [],
            );
          }
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.USER_NOT_FOUND,
            [],
          );
        }
      } else if (signupFromEmailPasswordRequestDto.type == 'signup') {
        if (
          (userFind && userFind.isVerified == true) ||
          (userFind && userFind.registerType == 'Password')
        ) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.USER_ALREADY_EXIST,
            [],
          );
        } else {
          if (!signupFromEmailPasswordRequestDto.password) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.PASSWORD_REQUIRED,
              [],
            );
          }
          if (userFind) {
            signupFromEmailPasswordRequestDto.password =
              await helperUtil.hashedPassword(
                signupFromEmailPasswordRequestDto.password,
              );

            let updateUser: any;
            if (checkEmailValue) {
              updateUser = await this.userRepository.userDataCreate({
                email: signupFromEmailPasswordRequestDto.email,
                singupFromEmailPasswordRequestDto:
                  signupFromEmailPasswordRequestDto,
              });
            } else {
              updateUser = await this.userRepository.userDataUpdated(
                { mobileNumber: signupFromEmailPasswordRequestDto.email },
                signupFromEmailPasswordRequestDto,
              );
            }
            const payload = {
              user: {
                id: updateUser._id,
              },
            };
            const token = helperUtil.generateToken({ payload });
            return sendResponse(res, StatusCodes.CREATED, userEnum.REGISTERED, {
              ...updateUser._doc,
              token,
            });
          }
          const referCode = helperUtil.referralCode(8);
          let findReferralUser = null;
          // For Referral Code
          if (signupFromEmailPasswordRequestDto.referralByCode) {
            findReferralUser = await this.userRepository.getSingleUserData({
              referralCode: signupFromEmailPasswordRequestDto.referralByCode,
              is_deleted: 0,
            });
            if (!findReferralUser) {
              return sendResponse(
                res,
                StatusCodes.NOT_FOUND,
                userEnum.REFERRAL_CODE_NOT_FOUND,
                [],
              );
            }
          }
          signupFromEmailPasswordRequestDto.password =
            await helperUtil.hashedPassword(
              signupFromEmailPasswordRequestDto.password,
            );
          const createUser = await this.userRepository.userDataCreate({
            fullName: signupFromEmailPasswordRequestDto.fullName,
            email: checkEmailValue
              ? signupFromEmailPasswordRequestDto.email
              : '',
            mobileNumber: !checkEmailValue
              ? signupFromEmailPasswordRequestDto.email
              : '',
            currency: signupFromEmailPasswordRequestDto.currency,
            password: signupFromEmailPasswordRequestDto.password,
            referralCode: referCode,
            registerType: signupFromEmailPasswordRequestDto.registerType,
            isVerified: true,
            referralByCode: signupFromEmailPasswordRequestDto.referralByCode
              ? signupFromEmailPasswordRequestDto.referralByCode
              : null,
          });
          if (findReferralUser) {
            await this.referralUserRepository.createUserReferral({
              userId: findReferralUser._id,
              referralUser: createUser._id,
              referralByCode: signupFromEmailPasswordRequestDto.referralByCode,
            });
          }
          if (createUser) {
            await this.rewardUserRepository.createUserReward({
              userId: createUser._id,
              title: 'Created Reward',
              description: 'First time reward from admin side',
            });
          }
          const payload = {
            user: {
              id: createUser._id,
            },
          };
          const token = helperUtil.generateToken({ payload });
          return sendResponse(res, StatusCodes.CREATED, userEnum.REGISTERED, {
            ...createUser._doc,
            token,
          });
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.INVALID_TYPE,
          [],
        );
      }
    } catch (error) {
      console.log({ error });
      Logger.error.error(
        'user.service --> singupFromEmailPasswordDetails() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async setUserVerifyOtp(
    req: Request | any,
    res: Response,
    verifyUserOtpRequestDto: VerifyUserOtpRequestDto,
  ): Promise<any> {
    try {
      verifyUserOtpRequestDto.email = verifyUserOtpRequestDto.email
        ? verifyUserOtpRequestDto.email.toLowerCase()
        : null;

      const findUser = await this.userRepository.getSingleUserData({
        _id: verifyUserOtpRequestDto.userId,
        is_deleted: 0,
      });

      if (findUser) {
        if (findUser.otp != verifyUserOtpRequestDto.otp) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.INVALID_OTP,
            [],
          );
        } else {
          if (verifyUserOtpRequestDto.type == 'signup') {
            const userUpdate = await this.userRepository.userDataUpdated(
              { _id: verifyUserOtpRequestDto.userId },
              { isVerified: true, otp: null },
            );
            const payload = {
              user: {
                id: userUpdate._id,
              },
            };
            const token = helperUtil.generateToken({ payload });
            return sendResponse(res, StatusCodes.OK, userEnum.REGISTERED, {
              ...userUpdate._doc,
              token,
              type: verifyUserOtpRequestDto.type,
            });
          } else if (verifyUserOtpRequestDto.type == 'login') {
            if (!findUser.isActive) {
              return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                userEnum.DEACTIVATED_USER,
                [],
              );
            }
            const userUpdate = await this.userRepository.userDataUpdated(
              { _id: verifyUserOtpRequestDto.userId },
              { isVerified: true, isLogin: true, otp: null },
            );
            const payload = {
              user: {
                id: userUpdate._id,
              },
            };
            const token = helperUtil.generateToken({ payload });
            return sendResponse(res, StatusCodes.OK, userEnum.LOGIN, {
              ...userUpdate._doc,
              token,
              type: 'login',
            });
          } else if (verifyUserOtpRequestDto.type == 'forgotPassword') {
            findUser.otp = null;
            await findUser.save();
            const updateUser = await this.userRepository.userDataUpdated(
              { _id: findUser._id },
              { resetPasswordAllow: true },
            );
            return sendResponse(
              res,
              StatusCodes.OK,
              userEnum.VERIFICATION_COMPLETED,
              { ...updateUser._doc, type: 'forgotPassword' },
            );
          } else if (verifyUserOtpRequestDto.type == 'mPin') {
            //mpin set code
          } else if (verifyUserOtpRequestDto.type == 'emailVerify') {
            if (
              !verifyUserOtpRequestDto.email &&
              !verifyUserOtpRequestDto.mobileNumber
            ) {
              return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                userEnum.ENTER_EMAIL_PASSWORD,
                [],
              );
            }
            const updateUser = await this.userRepository.userDataUpdated(
              { _id: verifyUserOtpRequestDto.userId, is_deleted: 0 },
              {
                email: verifyUserOtpRequestDto.email,
                mobileNumber: verifyUserOtpRequestDto.mobileNumber,
                address: verifyUserOtpRequestDto.address,
                otp: null,
              },
            );
            return sendResponse(
              res,
              StatusCodes.OK,
              userEnum.PROFILE_UPDATED,
              updateUser,
            );
          } else {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.INVALID_OTP,
              [],
            );
          }
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.USER_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> setUserVerifyOtp() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async setUserResendOtp(
    req: Request | any,
    res: Response,
    userId: string,
  ): Promise<any> {
    try {
      const otp = 4444;
      // const otp = generateOtp();
      const findUser = await this.userRepository.getSingleUserData({
        _id: userId,
        is_deleted: 0,
      });

      if (findUser) {
        const updateOtp = await this.userRepository.userDataUpdated(
          { _id: userId },
          { otp },
        );
        // let mailInfo = await ejs.renderFile('src/views/VerifyOtp.ejs', { otp });
        // await sendMail(findUser.email, 'Verify Otp', mailInfo);
        return sendResponse(
          res,
          StatusCodes.OK,
          userEnum.OTP_RESEND,
          updateOtp,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.USER_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> setUserVerifyOtp() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async setPasswordUser(
    req: Request | any,
    res: Response,
    password: string,
  ): Promise<any> {
    try {
      const findUser = await this.userRepository.getSingleUserData({
        _id: req.user,
      });
      if (findUser) {
        if (findUser.password != null) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.SET_PASSWORD_ALREADY,
            [],
          );
        }
        findUser.password = await helperUtil.hashedPassword(password);
        await findUser.save();
        return sendResponse(
          res,
          StatusCodes.OK,
          userEnum.SET_PASSWORD,
          findUser,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.USER_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> setPasswordUser() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async connectToUserWallet(
    req: Request,
    res: Response,
    connectToWalletUserRequestDto: ConnectToWalletUserRequestDto,
  ): Promise<any> {
    try {
      let existingUser: any;
      const walletArray = [JSON.parse(connectToWalletUserRequestDto.wallet[0])];
      const otp = helperUtil.generateOtp();
      const lowercasedEmail = connectToWalletUserRequestDto.email
        ? connectToWalletUserRequestDto.email.toLowerCase()
        : '';
      if (lowercasedEmail) {
        existingUser = await this.userRepository.getSingleUserData({
          email: lowercasedEmail,
        });
      }
      if (existingUser) {
        await existingUser.updateOne({
          $set: {
            wallet: {
              walletAddress: walletArray[0].walletAddress,
              walletType: walletArray[0].walletType,
              isConnected: true,
              isVerified: true,
            },
          },
        });
        return sendResponse(
          res,
          StatusCodes.CREATED,
          userEnum.WALLET_CONNECT,
          '',
        );
      }

      const walletUser = await this.userRepository.getSingleUserData({
        'wallet.walletAddress':
          connectToWalletUserRequestDto.wallet.walletAddress,
        'wallet.walletType': connectToWalletUserRequestDto.wallet.walletType,
      });

      if (walletUser) {
        // await walletUser.updateOne({ $set: { "wallet.$.isConnected": true } });
        await walletUser.updateOne({
          $set: { 'wallet.$.isConnected': true, isVerified: true },
        });
        const payload = {
          user: {
            id: walletUser._id,
          },
        };
        const token = helperUtil.generateToken({ payload });
        return sendResponse(res, StatusCodes.CREATED, userEnum.LOGIN, {
          ...walletUser._doc,
          token: token,
        });
      }
      const referCode = helperUtil.referralCode(8);
      const newUser = await this.userRepository.userDataCreate({
        email: lowercasedEmail,
        currency: connectToWalletUserRequestDto.currency,
        password: connectToWalletUserRequestDto.password,
        wallet: {
          walletAddress: walletArray[0].walletAddress,
          walletType: walletArray[0].walletType,
          isConnected: true,
        },
        isVerified: true,
        referralCode: referCode,
        otp,
      });

      if (newUser) {
        await this.rewardUserRepository.createUserReward({
          userId: newUser._id,
          title: 'Created Reward',
          description: 'First time reward from admin side',
        });
      }
      const payload = {
        user: {
          id: newUser._id,
        },
      };
      const token = await helperUtil.generateToken({ payload });
      return sendResponse(res, StatusCodes.CREATED, userEnum.WALLET_CONNECT, {
        ...newUser._doc,
        token: token,
      });
    } catch (error) {
      Logger.error.error(
        'user.service --> connectToUserWallet() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async checkUserWalletAddress(
    req: Request,
    res: Response,
    checkWalletAddressUserRequestDto: CheckWalletAddressUserRequestDto,
  ): Promise<any> {
    try {
      const queryOjb: any = {
        'wallet.walletAddress': checkWalletAddressUserRequestDto.walletAddress,
        'wallet.isConnected': true,
      };
      if (checkWalletAddressUserRequestDto.email) {
        queryOjb.email = checkWalletAddressUserRequestDto.email;
      }
      const existingUser = await this.userRepository.getSingleUserData({
        queryOjb,
      });

      if (existingUser) {
        const payload = {
          user: {
            id: existingUser._id,
          },
        };
        const token = helperUtil.generateToken({ payload });
        existingUser.walletConnected = 'Yes';
        await existingUser.save();
        return sendResponse(res, StatusCodes.OK, '', {
          ...existingUser._doc,
          token: token,
        });
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.USER_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> checkUserWalletAddress() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async singInUserWalletAddress(
    req: Request,
    res: Response,
    singInWalletAddressUserRequestDto: SingInWalletAddressUserRequestDto,
  ): Promise<any> {
    try {
      const findWalletAddress = await this.userRepository.getSingleUserData({
        walletAddress: singInWalletAddressUserRequestDto.walletAddress,
      });

      if (findWalletAddress) {
        if (findWalletAddress.is_deleted != 0) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.DEACTIVATED_USER,
            [],
          );
        }
        if (!findWalletAddress.isActive) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.DEACTIVATED_USER,
            [],
          );
        }
        const payload = {
          user: {
            id: findWalletAddress._id,
          },
        };
        findWalletAddress.isLogin = true;
        await findWalletAddress.save();
        const token = helperUtil.generateToken({ payload });
        return sendResponse(res, StatusCodes.OK, userEnum.USER_LOGGED_IN, {
          ...findWalletAddress._doc,
          token,
        });
      } else {
        const referCode = helperUtil.referralCode(8);
        let findReferralUser = null;
        // For Referral Code
        if (singInWalletAddressUserRequestDto.referralByCode) {
          findReferralUser = await this.userRepository.getSingleUserData({
            referralCode: singInWalletAddressUserRequestDto.referralByCode,
            is_deleted: 0,
          });
          if (!findReferralUser) {
            return sendResponse(
              res,
              StatusCodes.NOT_FOUND,
              userEnum.REFERRAL_CODE_NOT_FOUND,
              [],
            );
          }
        }
        const createUser = await this.userRepository.userDataCreate({
          walletAddress: singInWalletAddressUserRequestDto.walletAddress,
          currency: singInWalletAddressUserRequestDto.currency,
          walletConnected: 'Yes',
          referralCode: referCode,
          referralByCode: singInWalletAddressUserRequestDto.referralByCode
            ? singInWalletAddressUserRequestDto.referralByCode
            : null,
        });
        if (findReferralUser) {
          findReferralUser.useReferralCodeUsers.push(createUser._id);
          await findReferralUser.save();
        }
        const payload = {
          user: {
            id: createUser._id,
          },
        };
        const token = helperUtil.generateToken({ payload });
        return sendResponse(res, StatusCodes.CREATED, userEnum.USER_LOGGED_IN, {
          ...createUser._doc,
          token,
        });
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> singInUserWalletAddress() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async forgotUserPassword(
    req: Request,
    res: Response,
    email: string,
  ): Promise<any> {
    try {
      email = email ? email.toLowerCase() : null;

      const userData = await this.userRepository.getSingleUserData({
        email: email,
        is_deleted: 0,
      });

      if (userData) {
        const otp = 4444;
        // const otp = generateOtp();
        // let mailInfo = await ejs.renderFile("src/views/ForgotPassword.ejs", {
        //   otp,
        // });
        const updateOtp = await this.userRepository.userDataUpdated(
          { _id: userData._id },
          { otp },
        );
        // await sendMail(userData.email, "Forgot Password", mailInfo).then(
        //   (data) => {
        //     if (data == 0) {
        //       return sendResponse(
        //         res,
        //         StatusCodes.BAD_REQUEST,
        //         userEnum.SOMETHING_WENT_WRONG,
        //         []
        //       );
        //     } else {
        //       return sendResponse(
        //         res,
        //         StatusCodes.OK,
        //         userEnum.RESET_PASSWORD_MAIL,
        //         updateOtp
        //       );
        //     }
        //   }
        // );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          userEnum.ACCOUNT_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> singInUserWalletAddress() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async verifyUserForgotOtp(
    req: Request,
    res: Response,
    verifyForgotOtpUserRequestDto: VerifyForgotOtpUserRequestDto,
  ): Promise<any> {
    try {
      verifyForgotOtpUserRequestDto.email = verifyForgotOtpUserRequestDto.email
        ? verifyForgotOtpUserRequestDto.email.toLowerCase()
        : null;

      const user = await this.userRepository.getSingleUserData({
        _id: verifyForgotOtpUserRequestDto.userId,
        is_deleted: 0,
      });

      if (
        verifyForgotOtpUserRequestDto.flag == 1 &&
        verifyForgotOtpUserRequestDto.userId
      ) {
        if (
          !verifyForgotOtpUserRequestDto.email &&
          !verifyForgotOtpUserRequestDto.mobileNumber
        ) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.ENTER_EMAIL_PASSWORD,
            [],
          );
        }
        if (user.otp !== verifyForgotOtpUserRequestDto.otp) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.INVALID_OTP,
            [],
          );
        }
        const updatedUser = await this.userRepository.userDataUpdated(
          { _id: verifyForgotOtpUserRequestDto.userId },
          {
            email: verifyForgotOtpUserRequestDto.email,
            mobileNumber: verifyForgotOtpUserRequestDto.mobileNumber,
            otp: null,
          },
        );
        return sendResponse(
          res,
          StatusCodes.OK,
          userEnum.VERIFICATION_COMPLETED,
          updatedUser,
        );
      } else {
        if (user) {
          if (user?.otp == verifyForgotOtpUserRequestDto.otp) {
            user.otp = null;
            await user.save();
            const updateUser = await this.userRepository.userDataUpdated(
              { _id: user._id },
              { resetPasswordAllow: true },
            );
            return sendResponse(
              res,
              StatusCodes.OK,
              userEnum.VERIFICATION_COMPLETED,
              updateUser,
            );
          } else {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              userEnum.INVALID_OTP,
              [],
            );
          }
        } else {
          return sendResponse(
            res,
            StatusCodes.NOT_FOUND,
            userEnum.USER_NOT_FOUND,
            [],
          );
        }
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> singInUserWalletAddress() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async resetUserPassword(
    req: Request,
    res: Response,
    userId: string,
    password: string,
  ): Promise<any> {
    try {
      const user = await this.userRepository.getSingleUserData({
        _id: userId,
        is_deleted: 0,
      });

      if (!user) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          userEnum.USER_NOT_FOUND,
          [],
        );
      }

      if (!user.resetPasswordAllow) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.OTP_NOT_VERIFY,
          [],
        );
      }
      password = await helperUtil.hashedPassword(password);
      const upadteUser = await this.userRepository.userDataUpdated(
        { _id: user._id },
        { password, resetPasswordAllow: false },
      );
      if (upadteUser) {
        return sendResponse(
          res,
          StatusCodes.OK,
          userEnum.RESET_PASSWORD,
          upadteUser,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.SOMETHING_WENT_WRONG,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> resetUserPassword() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async updateUserProfile(
    req: Request | any,
    res: Response,
    editProfileUserRequestDto: EditProfileUserRequestDto,
  ): Promise<any> {
    try {
      let message: any;
      const findData = await this.userRepository.getSingleUserData({
        _id: req.user,
        is_deleted: 0,
      });
      if (!findData) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          userEnum.USER_NOT_FOUND,
          [],
        );
      }
      if (req.body.email) {
        const checkEmail = await this.userRepository.getSingleUserData({
          _id: { $ne: req.user },
          email: {
            $regex: '^' + editProfileUserRequestDto.email + '$',
            $options: 'i',
          },
        });
        if (checkEmail) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.EMAIL_ALREADY_EXIST,
            [],
          );
        }
      }
      if (findData.email != editProfileUserRequestDto.email) {
        editProfileUserRequestDto.profile = req.profileUrl
          ? req.profileUrl
          : findData.profile;
        const objectEncrtypt = helperUtil.encryptObject({
          userId: findData._id,
          email: editProfileUserRequestDto.email,
        });
        // if (editProfileUserRequestDto.email) {
        //   let mailInfo = await ejs.renderFile('src/views/VerifyEmail.ejs', {
        //     objectEncrtypt,
        //   });
        //   await sendMail(editProfileUserRequestDto.email, 'Verify Email', mailInfo);
        // }
        const updateProfile = await this.userRepository.userDataUpdated(
          { _id: findData._id, is_deleted: 0 },
          {
            isVerified: false,
            email: editProfileUserRequestDto.email,
            profile: editProfileUserRequestDto.profile,
            fullName: editProfileUserRequestDto.fullName,
            bankDetails: {
              bankName: editProfileUserRequestDto.bankDetails.bankName,
              branch: editProfileUserRequestDto.bankDetails.branch,
              accountHolder:
                editProfileUserRequestDto.bankDetails.accountHolder,
              accountNumber:
                editProfileUserRequestDto.bankDetails.accountNumber,
              IFSCCode: editProfileUserRequestDto.bankDetails.IFSCCode,
            },
          },
        );

        if (
          editProfileUserRequestDto.bankDetails.bankName ||
          editProfileUserRequestDto.bankDetails.branch ||
          editProfileUserRequestDto.bankDetails.accountHolder ||
          editProfileUserRequestDto.bankDetails.accountNumber ||
          editProfileUserRequestDto.bankDetails.IFSCCode
        ) {
          message = userEnum.BANK_DETAILS_UPDATED;
        } else {
          message = userEnum.PROFILE_UPDATED;
        }
        return sendResponse(res, StatusCodes.OK, message, updateProfile);
      } else {
        req.body.profile = req.profileUrl ? req.profileUrl : findData.profile;
        const userData = await this.userRepository.userDataUpdated(
          { _id: findData._id, is_deleted: 0 },
          {
            profile: editProfileUserRequestDto.profile,
            fullName: editProfileUserRequestDto.fullName,
            bankDetails: {
              bankName: editProfileUserRequestDto.bankDetails.bankName,
              branch: editProfileUserRequestDto.bankDetails.branch,
              accountHolder:
                editProfileUserRequestDto.bankDetails.accountHolder,
              accountNumber:
                editProfileUserRequestDto.bankDetails.accountNumber,
              IFSCCode: editProfileUserRequestDto.bankDetails.IFSCCode,
            },
          },
        );
        if (userData) {
          return sendResponse(
            res,
            StatusCodes.OK,
            userEnum.PROFILE_UPDATED,
            userData,
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.USER_NOT_FOUND,
            [],
          );
        }
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> updateUserProfile() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async changeUserPassword(
    req: Request | any,
    res: Response,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const user = await this.userRepository.getSingleUserData({
        _id: req.user,
        is_deleted: 0,
      });

      if (user) {
        if (user.password == null) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.SET_NOT_PASSWORD,
            [],
          );
        }
        const verifyOldPassword = await helperUtil.passwordCompare(
          oldPassword,
          user.password,
        );
        if (!verifyOldPassword) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            userEnum.OLD_PASSWORD_WRONG,
            [],
          );
        }
        user.password = await helperUtil.hashedPassword(newPassword);
        await user.save();
        return sendResponse(
          res,
          StatusCodes.OK,
          userEnum.PASSWORD_CHANGED,
          user,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          userEnum.USER_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> changeUserPassword() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async userLogout(req: Request | any, res: Response): Promise<any> {
    try {
      const findUser = await this.userRepository.getSingleUserData({
        _id: req.user,
        is_deleted: 0,
      });
      if (findUser) {
        await this.userRepository.userDataUpdated(
          { _id: req.user, is_deleted: 0 },
          { isLogin: false },
        );
        return sendResponse(res, StatusCodes.OK, userEnum.USER_LOGOUT, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          userEnum.USER_NOT_EXIST,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> userLogout() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async editUserProfile(
    req: Request | any,
    res: Response,
    fullName: string,
    mobileNumber: string,
    email: string,
  ): Promise<any> {
    try {
      const Id = req.user;
      email = email ? email.toLowerCase() : null;
      const otp = 4444;
      const user = await this.userRepository.getUserDataById(Id);

      // if (req.files.profile) {
      //   fs.unlink('./public/uploads/' + user.profile, () => {});
      // } else if (req.body.removeProfileUrl) {
      //   fs.unlink('./public/uploads/' + req.body.removeProfileUrl, () => {});
      //   user.profile = '';
      //   await user.save();
      // } else {
      //   req.profileUrl = user.profile;
      // }
      if (user.email == email && user.mobileNumber == mobileNumber) {
        const updatedData = await this.userRepository.userDataUpdatedById(
          Id,
          {
            $set: {
              fullName,
              [req.profileUrl == '' ? '' : 'profile']: req.profileUrl,
            },
          },
          { new: true, useFindAndModify: false },
        );

        return sendResponse(res, StatusCodes.OK, userEnum.USER_UPDATED, [
          { user: updatedData, flag: 0 },
        ]);
      } else if (user.email !== email && user.mobileNumber == mobileNumber) {
        user.otp = otp;
        user.profile = req.profileUrl;
        user.fullName = fullName;
        await user.save();
        //otp sent code
        // const otp = generateOtp();
        // let mailInfo = await ejs.renderFile('src/views/ForgotPassword.ejs', {
        //   otp: otp,
        // });
        // await sendMail(user.email, 'Forgot Password', mailInfo);

        return sendResponse(res, StatusCodes.OK, userEnum.OTP_SENT_TO_BOTH, [
          { user, flag: 1 },
        ]);
      } else if (user.email == email && user.mobileNumber != mobileNumber) {
        user.fullName = fullName;
        user.profile = req.profileUrl;
        user.otp = otp;
        await user.save();
        //otp sent code
        // const otp = generateOtp();
        // let mailInfo = await ejs.renderFile('src/views/ForgotPassword.ejs', {
        //   otp: otp,
        // });
        // await sendMail(user.email, 'Forgot Password', mailInfo);

        return sendResponse(res, StatusCodes.OK, userEnum.OTP_SENT_TO_BOTH, [
          { user, flag: 1 },
        ]);
      }
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        userEnum.DATA_NOT_FOUND,
        [],
      );
    } catch (error) {
      Logger.error.error(
        'user.service --> userLogout() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async userAccountDeactivate(
    req: Request | any,
    res: Response,
  ): Promise<any> {
    try {
      const upadteUser = await this.userRepository.userDataUpdated(
        { _id: req.user },
        { isActive: false },
      );
      if (upadteUser) {
        return sendResponse(res, StatusCodes.OK, userEnum.USER_DEACTIVATED, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          userEnum.DATA_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'user.service --> userAccountDeactivate() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async userEmailVerify(
    req: Request | any,
    res: Response | any,
    key: string,
  ): Promise<any> {
    try {
      const objectEncrypt = await helperUtil.decryptObject(key);
      if (objectEncrypt === false) {
        return res.redirect('http://betting.appworkdemo.com/user');
        // return sendResponse(res, StatusCodes.BAD_REQUEST, userEnum.VERIFY_LINK_EXPIRE, []);
      }
      objectEncrypt.email = objectEncrypt.email
        ? objectEncrypt.email.toLowerCase()
        : null;
      if (!objectEncrypt.email) {
        return res.redirect('http://betting.appworkdemo.com/user');
        // return sendResponse(res, StatusCodes.BAD_REQUEST, userEnum.USER_NOT_FOUND, []);
      }

      const checkEmailExist = await this.userRepository.getSingleUserData({
        email: objectEncrypt.email,
      });
      if (checkEmailExist) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.EMAIL_ALREADY_EXIST,
          [],
        );
      }
      const findUser = await this.userRepository.getSingleUserData({
        _id: objectEncrypt.userId,
      });
      if (!findUser) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          userEnum.USER_NOT_FOUND,
          [],
        );
      }
      findUser.email = objectEncrypt.email;
      findUser.isVerified = true;
      findUser.isLogin = false;
      await findUser.save();
      return res.redirect('http://betting.appworkdemo.com/user');
      // await dataUpdated({ _id: findData._id, is_deleted: 0 }, { isVerified: false }, User);
    } catch (error) {
      Logger.error.error(
        'user.service --> userAccountDeactivate() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
