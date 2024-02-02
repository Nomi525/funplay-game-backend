import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import Logger from 'src/core/Logger';
import CommonRepository from 'src/helpers/commonRepository';
import { sendResponse } from 'src/helpers/commonService';
import { helperUtil } from 'src/helpers/helperUtils';
import UserRepository from 'src/modules/user/repository/user.repository';
import { TransactionEnum } from '../constants/enums/transaction.enum';
import {
  AddNewTransactionRequestDto,
  WithdrawalRequestRequestDto,
} from '../dto/transaction.dto';
import CurrencyCoinRepository from '../repository/currencyCoin.repository';
import TransactionRepository from '../repository/transaction.repository';
import TransactionHistoryRepository from '../repository/transactionHistory.repository';

@Injectable()
export class TransactionService extends CommonRepository {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
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

  public async addNewTransaction(
    req: Request | any,
    res: Response,
    addNewTransactionRequestDto: AddNewTransactionRequestDto,
  ): Promise<any> {
    try {
      const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
      const userCurrency = await this.userRepository.getSingleUserData({
        _id: req.user,
        is_deleted: 0,
      });

      if (!userCurrency.currency) {
        userCurrency.currency = 'USD';
        await userCurrency.save();
      }

      const currency =
        await this.currencyCoinRepository.getSingleCurrencyCoinData({
          currencyName: userCurrency.currency,
          is_deleted: 0,
        });
      const coinRate = currency?.coin;
      const dataNew = USDTPrice.data.data;

      // Bitcoin Tether BNB Polygon
      const findUser =
        await this.transactionRepository.getSingleTransactionData({
          userId: req.user,
        });
      if (!dataNew) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid token', []);
      }
      let value: any;
      const mapData = dataNew
        .filter((d: any) => d.name == addNewTransactionRequestDto.tokenName)
        .map(async (item: any) => {
          value =
            parseFloat(item.priceUsd) *
            parseFloat(addNewTransactionRequestDto.tokenAmount);
          if (findUser) {
            if (addNewTransactionRequestDto.tokenName == 'Bitcoin') {
              if (
                !findUser.bitcoinWalletAddress.includes(
                  addNewTransactionRequestDto.walletAddress,
                )
              ) {
                findUser.bitcoinWalletAddress.push(
                  addNewTransactionRequestDto.walletAddress,
                );
              }
            } else {
              if (
                !findUser.ethereumWalletAddress.includes(
                  addNewTransactionRequestDto.walletAddress,
                )
              ) {
                findUser.ethereumWalletAddress.push(
                  addNewTransactionRequestDto.walletAddress,
                );
              }
            }

            if (addNewTransactionRequestDto.tokenName == 'Bitcoin') {
              // Bitcoin
              if (findUser.tokenBitcoin) {
                findUser.tokenBitcoin = helperUtil.plusLargeSmallValue(
                  findUser.tokenBitcoin,
                  addNewTransactionRequestDto.tokenAmount,
                );
              } else {
                findUser.tokenBitcoin = parseFloat(
                  addNewTransactionRequestDto.tokenAmount,
                );
              }
            } else if (addNewTransactionRequestDto.tokenName == 'BNB') {
              // BNB
              if (findUser.tokenBNB) {
                findUser.tokenBNB = helperUtil.plusLargeSmallValue(
                  findUser.tokenBNB,
                  addNewTransactionRequestDto.tokenAmount,
                );
              } else {
                findUser.tokenBNB = parseFloat(
                  addNewTransactionRequestDto.tokenAmount,
                );
              }
            } else if (addNewTransactionRequestDto.tokenName == 'BUSD') {
              // BUSD
              if (findUser.tokenBUSD) {
                findUser.tokenBUSD = helperUtil.plusLargeSmallValue(
                  findUser.tokenBUSD,
                  addNewTransactionRequestDto.tokenAmount,
                );
              } else {
                findUser.tokenBUSD = parseFloat(
                  addNewTransactionRequestDto.tokenAmount,
                );
              }
            } else if (addNewTransactionRequestDto.tokenName == 'Ethereum') {
              // Ethereum
              if (findUser.tokenEthereum) {
                findUser.tokenEthereum = helperUtil.plusLargeSmallValue(
                  findUser.tokenEthereum,
                  addNewTransactionRequestDto.tokenAmount,
                );
              } else {
                findUser.tokenEthereum = parseFloat(
                  addNewTransactionRequestDto.tokenAmount,
                );
              }
            } else if (addNewTransactionRequestDto.tokenName == 'Polygon') {
              // Polygon
              if (findUser.tokenPolygon) {
                findUser.tokenPolygon = helperUtil.plusLargeSmallValue(
                  findUser.tokenPolygon,
                  addNewTransactionRequestDto.tokenAmount,
                );
              } else {
                findUser.tokenPolygon = parseFloat(
                  addNewTransactionRequestDto.tokenAmount,
                );
              }
            } else if (addNewTransactionRequestDto.tokenName == 'Tether') {
              if (addNewTransactionRequestDto.tetherType == 'PolygonUSDT') {
                // PolygonUSDT
                if (findUser.tokenPolygonUSDT) {
                  findUser.tokenPolygonUSDT = helperUtil.plusLargeSmallValue(
                    findUser.tokenPolygonUSDT,
                    addNewTransactionRequestDto.tokenAmount,
                  );
                } else {
                  findUser.tokenPolygonUSDT = parseFloat(
                    addNewTransactionRequestDto.tokenAmount,
                  );
                }
              } else if (
                addNewTransactionRequestDto.tetherType == 'EthereumUSDT'
              ) {
                // Ethereum USDT
                if (findUser.tokenEthereumUSDT) {
                  findUser.tokenEthereumUSDT = helperUtil.plusLargeSmallValue(
                    findUser.tokenEthereumUSDT,
                    addNewTransactionRequestDto.tokenAmount,
                  );
                } else {
                  findUser.tokenEthereumUSDT = parseFloat(
                    addNewTransactionRequestDto.tokenAmount,
                  );
                }
              } else {
                return { status: 'BAD_REQUEST', data: [] };
              }
            }
            findUser.tokenDollarValue = helperUtil.plusLargeSmallValue(
              findUser.tokenDollarValue,
              value,
            );
            await findUser.save();
            const coinValue = Number(value) * Number(coinRate);
            await this.transactionRepository.transactionDataUpdated(
              { userId: req.user },
              { $inc: { totalCoin: coinValue } },
            );
            await this.transactionHistoryRepository.transactionHistoryDataCreate(
              {
                userId: req.user,
                networkChainId: addNewTransactionRequestDto.networkChainId,
                tokenName: addNewTransactionRequestDto.tokenName,
                tokenAmount: addNewTransactionRequestDto.tokenAmount,
                walletAddress: addNewTransactionRequestDto.walletAddress,
                tokenDollarValue: value,
                totalCoin: value * coinRate,
                type: 'deposit',
              },
            );
            return { status: 'OK', data: findUser };
          } else {
            let bitcoinWalletAddress: string[];
            let ethereumWalletAddress: string[];
            if (addNewTransactionRequestDto.tokenName == 'Bitcoin') {
              bitcoinWalletAddress = [
                addNewTransactionRequestDto.walletAddress,
              ];
            } else {
              ethereumWalletAddress = [
                addNewTransactionRequestDto.walletAddress,
              ];
            }
            const createObject: any = {
              userId: req.user,
              bitcoinWalletAddress,
              ethereumWalletAddress,
              networkChainId: addNewTransactionRequestDto.networkChainId,
              tokenDollarValue: parseFloat(value),
              totalCoin: Number(value) * Number(coinRate),
            };

            if (addNewTransactionRequestDto.tokenName == 'Bitcoin') {
              // Bitcoin
              createObject.tokenBitcoin = parseFloat(
                addNewTransactionRequestDto.tokenAmount,
              );
            } else if (addNewTransactionRequestDto.tokenName == 'BNB') {
              // BNB
              createObject.tokenBNB = parseFloat(
                addNewTransactionRequestDto.tokenAmount,
              );
            } else if (addNewTransactionRequestDto.tokenName == 'BUSD') {
              // BUSD
              createObject.tokenBUSD = parseFloat(
                addNewTransactionRequestDto.tokenAmount,
              );
            } else if (addNewTransactionRequestDto.tokenName == 'Ethereum') {
              // Ethereum
              createObject.tokenEthereum = parseFloat(
                addNewTransactionRequestDto.tokenAmount,
              );
            } else if (addNewTransactionRequestDto.tokenName == 'Polygon') {
              // Polygon
              createObject.tokenPolygon = parseFloat(
                addNewTransactionRequestDto.tokenAmount,
              );
            } else if (addNewTransactionRequestDto.tokenName == 'Tether') {
              if (addNewTransactionRequestDto.tetherType == 'PolygonUSDT') {
                // PolygonUSDT
                createObject.tokenPolygonUSDT = parseFloat(
                  addNewTransactionRequestDto.tokenAmount,
                );
              } else if (
                addNewTransactionRequestDto.tetherType == 'EthereumUSDT'
              ) {
                // Ethereum USDT
                createObject.tokenEthereumUSDT = parseFloat(
                  addNewTransactionRequestDto.tokenAmount,
                );
              } else {
                return { status: 'BAD_REQUEST', data: [] };
              }
            }
            const createTransaction =
              await this.transactionRepository.transactionDataCreate(
                createObject,
              );
            await this.transactionHistoryRepository.transactionHistoryDataCreate(
              {
                userId: req.user,
                networkChainId: addNewTransactionRequestDto.networkChainId,
                tokenName: addNewTransactionRequestDto.tokenName,
                tokenAmount: addNewTransactionRequestDto.tokenAmount,
                walletAddress: addNewTransactionRequestDto.tokenAmount,
                // tokenAmount: addNewTransactionRequestDto.tokenAmount,
                tokenDollarValue: value,
                type: 'deposit',
              },
            );

            return { status: 'CREATED', data: createTransaction };
          }
        });
      const promiseData = await Promise.all(mapData);
      if (promiseData[0]?.status == 'OK') {
        return sendResponse(
          res,
          StatusCodes.OK,
          TransactionEnum.TRANSACTION_UPDATED,
          promiseData[0]?.data,
        );
      } else if (promiseData[0]?.status == 'CREATED') {
        return sendResponse(
          res,
          StatusCodes.CREATED,
          TransactionEnum.TRANSITION_CREATED,
          promiseData[0]?.data,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          TransactionEnum.DATA_NOT_FOUND,
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

  public async withdrawalRequest(
    req: Request | any,
    res: Response,
    withdrawalRequestRequestDto: WithdrawalRequestRequestDto,
  ): Promise<any> {
    try {
      const findTransaction =
        await this.transactionRepository.getSingleTransactionData({
          userId: req.user,
          $or: [
            { bitcoinWalletAddress: withdrawalRequestRequestDto.walletAddress },
            {
              ethereumWalletAddress: withdrawalRequestRequestDto.walletAddress,
            },
          ],
        });
      const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
      const userCurrency = await this.userRepository.getSingleUserData({
        _id: req.user,
        is_deleted: 0,
      });
      const currency =
        await this.currencyCoinRepository.getSingleCurrencyCoinData({
          currencyName: userCurrency ? userCurrency.currency : 'USD',
          is_deleted: 0,
        });
      const coinRate = currency?.coin;
      const dataNew = USDTPrice?.data?.data;
      if (!dataNew) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, 'Bad Request', []);
      }
      let value: any;
      if (findTransaction) {
        const mapData = dataNew
          .filter((d) => d.name == withdrawalRequestRequestDto.tokenName)
          .map(async (item) => {
            value =
              parseFloat(item.priceUsd) *
              parseFloat(withdrawalRequestRequestDto.tokenAmount);
            const coin = Number(value) * Number(coinRate);
            if (!(findTransaction.totalCoin >= coin)) {
              return {
                status: 400,
                message: TransactionEnum.INSUFFICIENT_BALANCE,
                data: [],
              };
            }
            // const remainingCoin = findTransaction.totalCoin - (Number(value) * Number(coinRate));
            const remainingCoin = findTransaction.totalCoin - coin;
            if (withdrawalRequestRequestDto.tokenName == 'Bitcoin') {
              // Bitcoin
              if (
                findTransaction.tokenBitcoin > 0 &&
                findTransaction.tokenBitcoin >=
                  parseFloat(withdrawalRequestRequestDto.tokenAmount) &&
                findTransaction.tokenDollarValue > 0 &&
                findTransaction.tokenDollarValue >= parseFloat(value)
              ) {
                findTransaction.tokenBitcoin = helperUtil.minusLargeSmallValue(
                  findTransaction.tokenBitcoin,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.tokenDollarValue =
                  helperUtil.minusLargeSmallValue(
                    findTransaction.tokenDollarValue,
                    value,
                  );
                findTransaction.blockDollar = helperUtil.plusLargeSmallValue(
                  findTransaction.blockDollar,
                  value,
                );
                findTransaction.blockAmount = helperUtil.plusLargeSmallValue(
                  findTransaction.blockAmount,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.totalCoin = remainingCoin;
                findTransaction.blockCoin =
                  Number(findTransaction.blockCoin) + Number(coin);
                await findTransaction.save();

                const transactionData =
                  await this.transactionHistoryRepository.transactionHistoryDataCreate(
                    {
                      userId: req.user,
                      networkChainId: findTransaction.networkChainId,
                      tokenName: withdrawalRequestRequestDto.tokenName,
                      tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      walletAddress: withdrawalRequestRequestDto.walletAddress,
                      // tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      tokenDollarValue: value,
                      coin,
                      type: 'withdrawal',
                    },
                  );

                // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, tetherType, coin }, WithdrawalRequest)

                return {
                  status: 200,
                  message: TransactionEnum.WITHDRAWAL_CREATED,
                  data: transactionData,
                };
              }
              return {
                status: 400,
                message: TransactionEnum.INSUFFICIENT_BALANCE,
                data: [],
              };
            } else if (withdrawalRequestRequestDto.tokenName == 'BNB') {
              // BNB
              if (
                findTransaction.tokenBNB > 0 &&
                findTransaction.tokenBNB >=
                  parseFloat(withdrawalRequestRequestDto.tokenAmount) &&
                findTransaction.tokenDollarValue > 0 &&
                findTransaction.tokenDollarValue >= parseFloat(value)
              ) {
                findTransaction.tokenBNB = helperUtil.minusLargeSmallValue(
                  findTransaction.tokenBNB,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.tokenDollarValue =
                  helperUtil.minusLargeSmallValue(
                    findTransaction.tokenDollarValue,
                    value,
                  );
                findTransaction.blockDollar = helperUtil.plusLargeSmallValue(
                  findTransaction.blockDollar,
                  value,
                );
                findTransaction.blockAmount = helperUtil.plusLargeSmallValue(
                  findTransaction.blockAmount,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.totalCoin = remainingCoin;
                findTransaction.blockCoin =
                  Number(findTransaction.blockCoin) + Number(coin);
                await findTransaction.save();

                const transactionData =
                  await this.transactionHistoryRepository.transactionHistoryDataCreate(
                    {
                      userId: req.user,
                      networkChainId: findTransaction.networkChainId,
                      tokenName: withdrawalRequestRequestDto.tokenName,
                      tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      walletAddress: withdrawalRequestRequestDto.walletAddress,
                      // tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      tokenDollarValue: value,
                      coin,
                      type: 'withdrawal',
                    },
                  );
                // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
                return {
                  status: 200,
                  message: TransactionEnum.WITHDRAWAL_CREATED,
                  data: transactionData,
                };
              }
              return {
                status: 400,
                message: TransactionEnum.INSUFFICIENT_BALANCE,
                data: [],
              };
              // } else if (tokenName == "Binance USD") {
            } else if (withdrawalRequestRequestDto.tokenName == 'BUSD') {
              // BUSD
              if (
                findTransaction.tokenBUSD > 0 &&
                findTransaction.tokenBUSD >=
                  parseFloat(withdrawalRequestRequestDto.tokenAmount) &&
                findTransaction.tokenDollarValue > 0 &&
                findTransaction.tokenDollarValue >= parseFloat(value)
              ) {
                findTransaction.tokenBUSD = helperUtil.minusLargeSmallValue(
                  findTransaction.tokenBUSD,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.tokenDollarValue =
                  helperUtil.minusLargeSmallValue(
                    findTransaction.tokenDollarValue,
                    value,
                  );
                findTransaction.blockDollar = helperUtil.plusLargeSmallValue(
                  findTransaction.blockDollar,
                  value,
                );
                findTransaction.blockAmount = helperUtil.plusLargeSmallValue(
                  findTransaction.blockAmount,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.totalCoin = remainingCoin;
                findTransaction.blockCoin =
                  Number(findTransaction.blockCoin) + Number(coin);
                await findTransaction.save();

                const transactionData =
                  await this.transactionHistoryRepository.transactionHistoryDataCreate(
                    {
                      userId: req.user,
                      networkChainId: findTransaction.networkChainId,
                      tokenName: withdrawalRequestRequestDto.tokenName,
                      tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      walletAddress: withdrawalRequestRequestDto.walletAddress,
                      // tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      tokenDollarValue: value,
                      coin,
                      type: 'withdrawal',
                    },
                  );
                // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
                return {
                  status: 200,
                  message: TransactionEnum.WITHDRAWAL_CREATED,
                  data: transactionData,
                };
              }
              return {
                status: 400,
                message: TransactionEnum.INSUFFICIENT_BALANCE,
                data: [],
              };
            } else if (withdrawalRequestRequestDto.tokenName == 'Ethereum') {
              // Ethereum
              if (
                findTransaction.tokenEthereum > 0 &&
                findTransaction.tokenEthereum >=
                  parseFloat(withdrawalRequestRequestDto.tokenAmount) &&
                findTransaction.tokenDollarValue > 0 &&
                findTransaction.tokenDollarValue >= parseFloat(value)
              ) {
                findTransaction.tokenEthereum = helperUtil.minusLargeSmallValue(
                  findTransaction.tokenEthereum,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.tokenDollarValue =
                  helperUtil.minusLargeSmallValue(
                    findTransaction.tokenDollarValue,
                    value,
                  );
                findTransaction.blockDollar = helperUtil.plusLargeSmallValue(
                  findTransaction.blockDollar,
                  value,
                );
                findTransaction.blockAmount = helperUtil.plusLargeSmallValue(
                  findTransaction.blockAmount,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.totalCoin = remainingCoin;
                findTransaction.blockCoin =
                  Number(findTransaction.blockCoin) + Number(coin);
                await findTransaction.save();

                const transactionData =
                  await this.transactionHistoryRepository.transactionHistoryDataCreate(
                    {
                      userId: req.user,
                      networkChainId: findTransaction.networkChainId,
                      tokenName: withdrawalRequestRequestDto.tokenName,
                      tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      walletAddress: withdrawalRequestRequestDto.walletAddress,
                      // tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      tokenDollarValue: value,
                      coin,
                      type: 'withdrawal',
                    },
                  );
                // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
                return {
                  status: 200,
                  message: TransactionEnum.WITHDRAWAL_CREATED,
                  data: transactionData,
                };
              }
              return {
                status: 400,
                message: TransactionEnum.INSUFFICIENT_BALANCE,
                data: [],
              };
            } else if (withdrawalRequestRequestDto.tokenName == 'Polygon') {
              // Polygon
              if (
                findTransaction.tokenPolygon > 0 &&
                findTransaction.tokenPolygon >=
                  parseFloat(withdrawalRequestRequestDto.tokenAmount) &&
                findTransaction.tokenDollarValue > 0 &&
                findTransaction.tokenDollarValue >= parseFloat(value)
              ) {
                findTransaction.tokenPolygon = helperUtil.minusLargeSmallValue(
                  findTransaction.tokenPolygon,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.tokenDollarValue =
                  helperUtil.minusLargeSmallValue(
                    findTransaction.tokenDollarValue,
                    value,
                  );
                findTransaction.blockDollar = helperUtil.plusLargeSmallValue(
                  findTransaction.blockDollar,
                  value,
                );
                findTransaction.blockAmount = helperUtil.plusLargeSmallValue(
                  findTransaction.blockAmount,
                  withdrawalRequestRequestDto.tokenAmount,
                );
                findTransaction.totalCoin = remainingCoin;
                findTransaction.blockCoin =
                  Number(findTransaction.blockCoin) + Number(coin);
                await findTransaction.save();
                const transactionData =
                  await this.transactionHistoryRepository.transactionHistoryDataCreate(
                    {
                      userId: req.user,
                      networkChainId: findTransaction.networkChainId,
                      tokenName: withdrawalRequestRequestDto.tokenName,
                      tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      walletAddress: withdrawalRequestRequestDto.walletAddress,
                      // tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                      tokenDollarValue: value,
                      coin,
                      type: 'withdrawal',
                    },
                  );
                // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
                return {
                  status: 200,
                  message: TransactionEnum.WITHDRAWAL_CREATED,
                  data: transactionData,
                };
              }
              return {
                status: 400,
                message: TransactionEnum.INSUFFICIENT_BALANCE,
                data: [],
              };
            } else if (withdrawalRequestRequestDto.tokenName == 'Tether') {
              if (withdrawalRequestRequestDto.tetherType == 'PolygonUSDT') {
                // PolygonUSDT
                if (
                  findTransaction.tokenPolygonUSDT > 0 &&
                  findTransaction.tokenPolygonUSDT >=
                    parseFloat(withdrawalRequestRequestDto.tokenAmount) &&
                  findTransaction.tokenDollarValue > 0 &&
                  findTransaction.tokenDollarValue >= parseFloat(value)
                ) {
                  findTransaction.tokenPolygonUSDT =
                    helperUtil.minusLargeSmallValue(
                      findTransaction.tokenPolygonUSDT,
                      withdrawalRequestRequestDto.tokenAmount,
                    );
                  findTransaction.tokenDollorValue =
                    helperUtil.minusLargeSmallValue(
                      findTransaction.tokenDollorValue,
                      value,
                    );
                  findTransaction.blockDollor = helperUtil.plusLargeSmallValue(
                    findTransaction.blockDollor,
                    value,
                  );
                  findTransaction.blockAmount = helperUtil.plusLargeSmallValue(
                    findTransaction.blockAmount,
                    withdrawalRequestRequestDto.tokenAmount,
                  );
                  findTransaction.totalCoin = remainingCoin;
                  findTransaction.blockCoin =
                    Number(findTransaction.blockCoin) + Number(coin);
                  await findTransaction.save();

                  const transactionData =
                    await this.transactionHistoryRepository.transactionHistoryDataCreate(
                      {
                        userId: req.user,
                        networkChainId: findTransaction.networkChainId,
                        tokenName: withdrawalRequestRequestDto.tokenName,
                        tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                        walletAddress:
                          withdrawalRequestRequestDto.walletAddress,
                        // tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                        tokenDollarValue: value,
                        tetherTypeP: withdrawalRequestRequestDto.tetherType,
                        coin,
                        type: 'withdrawal',
                      },
                    );
                  // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
                  return {
                    status: 200,
                    message: TransactionEnum.WITHDRAWAL_CREATED,
                    data: transactionData,
                  };
                }
                return {
                  status: 400,
                  message: TransactionEnum.INSUFFICIENT_BALANCE,
                  data: [],
                };
              } else if (
                withdrawalRequestRequestDto.tetherType == 'EthereumUSDT'
              ) {
                // Ethereum USDT
                if (
                  findTransaction.tokenEthereumUSDT > 0 &&
                  findTransaction.tokenEthereumUSDT >=
                    parseFloat(withdrawalRequestRequestDto.tokenAmount) &&
                  findTransaction.tokenDollarValue > 0 &&
                  findTransaction.tokenDollarValue >= parseFloat(value)
                ) {
                  findTransaction.tokenEthereumUSDT =
                    helperUtil.minusLargeSmallValue(
                      findTransaction.tokenEthereumUSDT,
                      withdrawalRequestRequestDto.tokenAmount,
                    );
                  findTransaction.tokenDollarValue =
                    helperUtil.minusLargeSmallValue(
                      findTransaction.tokenDollarValue,
                      value,
                    );
                  // For block coin
                  findTransaction.blockDollar = helperUtil.plusLargeSmallValue(
                    findTransaction.blockDollar,
                    value,
                  );
                  findTransaction.blockAmount = helperUtil.plusLargeSmallValue(
                    findTransaction.blockAmount,
                    withdrawalRequestRequestDto.tokenAmount,
                  );
                  findTransaction.totalCoin = remainingCoin;
                  findTransaction.blockCoin =
                    Number(findTransaction.blockCoin) + Number(coin);
                  await findTransaction.save();

                  const transactionData =
                    await this.transactionHistoryRepository.transactionHistoryDataCreate(
                      {
                        userId: req.user,
                        networkChainId: findTransaction.networkChainId,
                        tokenName: withdrawalRequestRequestDto.tokenName,
                        tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                        walletAddress:
                          withdrawalRequestRequestDto.walletAddress,
                        // tokenAmount: withdrawalRequestRequestDto.tokenAmount,
                        tokenDollarValue: value,
                        tetherType: withdrawalRequestRequestDto.tetherType,
                        coin,
                        type: 'withdrawal',
                      },
                    );
                  // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
                  return {
                    status: 200,
                    message: TransactionEnum.WITHDRAWAL_CREATED,
                    data: transactionData,
                  };
                }
                return {
                  status: 400,
                  message: TransactionEnum.INSUFFICIENT_BALANCE,
                  data: [],
                };
              } else {
                return {
                  status: 400,
                  message: TransactionEnum.INSUFFICIENT_BALANCE,
                  data: [],
                };
              }
            }
          });
        const promiseData = await Promise.all(mapData);
        if (promiseData[0] == undefined) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            TransactionEnum.WITHDRAWAL_INVALID,
            [],
          );
        }
        if (promiseData[0]?.status == 200) {
          return sendResponse(
            res,
            StatusCodes.OK,
            promiseData[0]?.message,
            promiseData[0]?.data,
          );
        } else if (promiseData[0]?.status == 400) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            promiseData[0]?.message,
            [],
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            TransactionEnum.WITHDRAWAL_INVALID,
            [],
          );
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          TransactionEnum.INSUFFICIENT_BALANCE,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'transaction.service --> withdrawalRequest() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
