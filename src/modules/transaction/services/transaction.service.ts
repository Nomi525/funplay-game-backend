import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import Logger from 'src/core/Logger';
import CommonRepository from 'src/helpers/commonRepository';
import { sendResponse } from 'src/helpers/commonService';
import UserRepository from 'src/modules/user/repository/user.repository';
import { TransactionEnum } from '../constants/enums/transaction.enum';
import CurrencyCoinRepository from '../repository/currencyCoin.repository';
import TransactionRepository from '../repository/transaction.repository';

@Injectable()
export class TransactionService extends CommonRepository {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
    private readonly currencyCoinRepository: CurrencyCoinRepository,
  ) {
    super();
  }

  public async getTotalUserAmountDeposit(
    req: Request | any,
    res: Response,
  ): Promise<any> {
    try {
      const findUser =
        await this.transactionRepository.getSingleTransactionData({
          userId: req.user,
        });
      if (findUser) {
        return sendResponse(
          res,
          StatusCodes.OK,
          TransactionEnum.GET_DEPOSIT_AMOUNT,
          {
            tokenDollarValue: findUser.tokenDollarValue,
          },
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.OK,
          TransactionEnum.GET_DEPOSIT_AMOUNT,
          {
            tokenDollarValue: 0,
          },
        );
      }
    } catch (error) {
      Logger.error.error(
        'transaction.service --> getTotalUserAmountDeposit() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getUserNewTransaction(
    req: Request | any,
    res: Response,
  ): Promise<any> {
    try {
      const transaction =
        await this.transactionRepository.getAllTransactionData({
          userId: req.user,
          is_deleted: 0,
        });
      if (transaction.length) {
        return sendResponse(
          res,
          StatusCodes.OK,
          TransactionEnum.TRANSACTION_GET,
          transaction,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          TransactionEnum.TRANSACTION_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'transaction.service --> getUserNewTransaction() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async userDepositWithdrawalHistory(
    req: Request | any,
    res: Response,
  ): Promise<any> {
    try {
      const history = await this.transactionRepository.getAllTransactionData({
        userId: req.user,
        is_deleted: 0,
      });
      if (history.length) {
        return sendResponse(
          res,
          StatusCodes.OK,
          TransactionEnum.TRANSACTION_GET,
          history,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          TransactionEnum.TRANSACTION_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'transaction.service --> userDepositWithdrawalHistory() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  // public async addNewTransaction(
  //   req: Request | any,
  //   res: Response,
  //   addNewTransactionAdminRequestDto: AddNewTransactionAdminRequestDto,
  // ): Promise<any> {
  //   try {
  //     const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
  //     const userCurrency = await this.userRepository.getSingleUserData({
  //       _id: req.user,
  //       is_deleted: 0,
  //     });

  //     if (!userCurrency.currency) {
  //       userCurrency.currency = 'USD';
  //       await userCurrency.save();
  //     }

  //     const currency =
  //       await this.currencyCoinRepository.getSingleCurrencyCoinData({
  //         currencyName: userCurrency.currency,
  //         is_deleted: 0,
  //       });
  //     const coinRate = currency?.coin;
  //     const dataNew = USDTPrice.data.data;

  //     // Bitcoin Tether BNB Polygon
  //     const findUser =
  //       await this.transactionRepository.getSingleTransactionData({
  //         userId: req.user,
  //       });
  //     if (!dataNew) {
  //       return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid token', []);
  //     }
  //     let value: any;
  //     const mapData = dataNew
  //       .filter(
  //         (d: any) => d.name == addNewTransactionAdminRequestDto.tokenName,
  //       )
  //       .map(async (item: any) => {
  //         value =
  //           parseFloat(item.priceUsd) *
  //           parseFloat(addNewTransactionAdminRequestDto.tokenAmount);
  //         if (findUser) {
  //           if (addNewTransactionAdminRequestDto.tokenName == 'Bitcoin') {
  //             if (
  //               !findUser.bitcoinWalletAddress.includes(
  //                 addNewTransactionAdminRequestDto.walletAddress,
  //               )
  //             ) {
  //               findUser.bitcoinWalletAddress.push(
  //                 addNewTransactionAdminRequestDto.walletAddress,
  //               );
  //             }
  //           } else {
  //             if (
  //               !findUser.ethereumWalletAddress.includes(
  //                 addNewTransactionAdminRequestDto.walletAddress,
  //               )
  //             ) {
  //               findUser.ethereumWalletAddress.push(
  //                 addNewTransactionAdminRequestDto.walletAddress,
  //               );
  //             }
  //           }

  //           if (addNewTransactionAdminRequestDto.tokenName == 'Bitcoin') {
  //             // Bitcoin
  //             if (findUser.tokenBitcoin) {
  //               findUser.tokenBitcoin = await plusLargeSmallValue(
  //                 findUser.tokenBitcoin,
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             } else {
  //               findUser.tokenBitcoin = parseFloat(
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             }
  //           } else if (addNewTransactionAdminRequestDto.tokenName == 'BNB') {
  //             // BNB
  //             if (findUser.tokenBNB) {
  //               findUser.tokenBNB = await plusLargeSmallValue(
  //                 findUser.tokenBNB,
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             } else {
  //               findUser.tokenBNB = parseFloat(
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             }
  //           } else if (addNewTransactionAdminRequestDto.tokenName == 'BUSD') {
  //             // BUSD
  //             if (findUser.tokenBUSD) {
  //               findUser.tokenBUSD = await plusLargeSmallValue(
  //                 findUser.tokenBUSD,
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             } else {
  //               findUser.tokenBUSD = parseFloat(
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             }
  //           } else if (
  //             addNewTransactionAdminRequestDto.tokenName == 'Ethereum'
  //           ) {
  //             // Ethereum
  //             if (findUser.tokenEthereum) {
  //               findUser.tokenEthereum = await plusLargeSmallValue(
  //                 findUser.tokenEthereum,
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             } else {
  //               findUser.tokenEthereum = parseFloat(
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             }
  //           } else if (
  //             addNewTransactionAdminRequestDto.tokenName == 'Polygon'
  //           ) {
  //             // Polygon
  //             if (findUser.tokenPolygon) {
  //               findUser.tokenPolygon = await plusLargeSmallValue(
  //                 findUser.tokenPolygon,
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             } else {
  //               findUser.tokenPolygon = parseFloat(
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             }
  //           } else if (addNewTransactionAdminRequestDto.tokenName == 'Tether') {
  //             if (
  //               addNewTransactionAdminRequestDto.tetherType == 'PolygonUSDT'
  //             ) {
  //               // PolygonUSDT
  //               if (findUser.tokenPolygonUSDT) {
  //                 findUser.tokenPolygonUSDT = await plusLargeSmallValue(
  //                   findUser.tokenPolygonUSDT,
  //                   addNewTransactionAdminRequestDto.tokenAmount,
  //                 );
  //               } else {
  //                 findUser.tokenPolygonUSDT = parseFloat(
  //                   addNewTransactionAdminRequestDto.tokenAmount,
  //                 );
  //               }
  //             } else if (
  //               addNewTransactionAdminRequestDto.tetherType == 'EthereumUSDT'
  //             ) {
  //               // Ethereum USDT
  //               if (findUser.tokenEthereumUSDT) {
  //                 findUser.tokenEthereumUSDT = await plusLargeSmallValue(
  //                   findUser.tokenEthereumUSDT,
  //                   addNewTransactionAdminRequestDto.tokenAmount,
  //                 );
  //               } else {
  //                 findUser.tokenEthereumUSDT = parseFloat(
  //                   addNewTransactionAdminRequestDto.tokenAmount,
  //                 );
  //               }
  //             } else {
  //               return { status: 'BAD_REQUST', data: [] };
  //             }
  //           }
  //           findUser.tokenDollorValue = await plusLargeSmallValue(
  //             findUser.tokenDollorValue,
  //             value,
  //           );
  //           await findUser.save();
  //           const coinValue = Number(value) * Number(coinRate);
  //           await NewTransaction.updateOne(
  //             { userId: req.user },
  //             { $inc: { totalCoin: coinValue } },
  //           );
  //           await dataCreate(
  //             {
  //               userId: req.user,
  //               networkChainId,
  //               tokenName,
  //               tokenAmount,
  //               walletAddress,
  //               tokenDollorValue: value,
  //               totalCoin: value * coinRate,
  //               type: 'deposit',
  //             },
  //             TransactionHistory,
  //           );

  //           return { status: 'OK', data: findUser };
  //         } else {
  //           let bitcoinWalletAddress;
  //           let ethereumWalletAddress;
  //           if (addNewTransactionAdminRequestDto.tokenName == 'Bitcoin') {
  //             bitcoinWalletAddress = [
  //               addNewTransactionAdminRequestDto.walletAddress,
  //             ];
  //           } else {
  //             ethereumWalletAddress = [
  //               addNewTransactionAdminRequestDto.walletAddress,
  //             ];
  //           }
  //           const createObject = {
  //             userId: req.user,
  //             bitcoinWalletAddress,
  //             ethereumWalletAddress,
  //             networkChainId,
  //             tokenDollorValue: parseFloat(value),
  //             totalCoin: Number(value) * Number(coinRate),
  //           };

  //           if (addNewTransactionAdminRequestDto.tokenName == 'Bitcoin') {
  //             // Bitcoin
  //             createObject.tokenBitcoin = parseFloat(
  //               addNewTransactionAdminRequestDto.tokenAmount,
  //             );
  //           } else if (addNewTransactionAdminRequestDto.tokenName == 'BNB') {
  //             // BNB
  //             createObject.tokenBNB = parseFloat(
  //               addNewTransactionAdminRequestDto.tokenAmount,
  //             );
  //           } else if (addNewTransactionAdminRequestDto.tokenName == 'BUSD') {
  //             // BUSD
  //             createObject.tokenBUSD = parseFloat(
  //               addNewTransactionAdminRequestDto.tokenAmount,
  //             );
  //           } else if (
  //             addNewTransactionAdminRequestDto.tokenName == 'Ethereum'
  //           ) {
  //             // Ethereum
  //             createObject.tokenEthereum = parseFloat(
  //               addNewTransactionAdminRequestDto.tokenAmount,
  //             );
  //           } else if (
  //             addNewTransactionAdminRequestDto.tokenName == 'Polygon'
  //           ) {
  //             // Polygon
  //             createObject.tokenPolygon = parseFloat(tokenAmount);
  //           } else if (addNewTransactionAdminRequestDto.tokenName == 'Tether') {
  //             if (
  //               addNewTransactionAdminRequestDto.tetherType == 'PolygonUSDT'
  //             ) {
  //               // PolygonUSDT
  //               createObject.tokenPolygonUSDT = parseFloat(
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             } else if (
  //               addNewTransactionAdminRequestDto.tetherType == 'EthereumUSDT'
  //             ) {
  //               // Ethereum USDT
  //               createObject.tokenEthereumUSDT = parseFloat(
  //                 addNewTransactionAdminRequestDto.tokenAmount,
  //               );
  //             } else {
  //               return { status: 'BAD_REQUST', data: [] };
  //             }
  //           }
  //           const createTransction = await dataCreate(
  //             createObject,
  //             NewTransaction,
  //           );
  //           await dataCreate(
  //             {
  //               userId: req.user,
  //               networkChainId,
  //               tokenName,
  //               tokenAmount,
  //               walletAddress,
  //               tokenAmount,
  //               tokenDollorValue: value,
  //               type: 'deposit',
  //             },
  //             TransactionHistory,
  //           );

  //           return { status: 'CREATED', data: createTransction };
  //         }
  //       });
  //     const promiseData = await Promise.all(mapData);
  //     if (promiseData[0]?.status == 'OK') {
  //       return sendResponse(
  //         res,
  //         StatusCodes.OK,
  //         TransactionEnum.TRANSACTION_UPDATED,
  //         promiseData[0]?.data,
  //       );
  //     } else if (promiseData[0]?.status == 'CREATED') {
  //       return sendResponse(
  //         res,
  //         StatusCodes.CREATED,
  //         TransactionEnum.TRANSITION_CREATED,
  //         promiseData[0]?.data,
  //       );
  //     } else {
  //       return sendResponse(
  //         res,
  //         StatusCodes.BAD_REQUEST,
  //         TransactionEnum.DATA_NOT_FOUND,
  //         [],
  //       );
  //     }
  //   } catch (error) {
  //     Logger.error.error(
  //       'transaction.service --> userDepositWithdrawalHistory() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
