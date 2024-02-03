import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import Logger from 'src/core/Logger';
import {
  AddNewTransactionRequestDto,
  WithdrawalRequestRequestDto,
} from '../dto/transaction.dto';
import { TransactionService } from '../services/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/total-amount-deposit')
  public async getTotalUserAmountDeposit(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info(
      'transaction.controller --> info of getTotalUserAmountDeposit()',
    );
    try {
      const getTotalUserAmountDepositData =
        await this.transactionService.getTotalUserAmountDeposit(req, res);
      return getTotalUserAmountDepositData;
    } catch (error) {
      Logger.error.error(
        'transaction.controller --> getTotalUserAmountDeposit() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/new-transitions')
  public async getUserNewTransaction(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info(
      'transaction.controller --> info of getTotalUserAmountDeposit()',
    );
    try {
      const getUserNewTransactionData =
        await this.transactionService.getUserNewTransaction(req, res);
      return getUserNewTransactionData;
    } catch (error) {
      Logger.error.error(
        'transaction.controller --> getTotalUserAmountDeposit() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-deposit-withdrawal')
  public async userDepositWithdrawalHistory(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info(
      'transaction.controller --> info of userDepositWithdrawalHistory()',
    );
    try {
      const getUserNewTransactionData =
        await this.transactionService.userDepositWithdrawalHistory(req, res);
      return getUserNewTransactionData;
    } catch (error) {
      Logger.error.error(
        'transaction.controller --> userDepositWithdrawalHistory() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-all-currency')
  public async getAllCurrency(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info('transaction.controller --> info of getAllCurrency()');
    try {
      const getAllCurrencyData = await this.transactionService.getAllCurrency(
        req,
        res,
      );
      return getAllCurrencyData;
    } catch (error) {
      Logger.error.error(
        'transaction.controller --> getAllCurrency() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/new-transaction/add')
  public async addNewTransaction(
    @Req() req: Request,
    @Res() res: Response,
    @Body() addNewTransactionRequestDto: AddNewTransactionRequestDto,
  ): Promise<any> {
    Logger.access.info(
      'transaction.controller --> info of addNewTransaction()',
    );
    try {
      const addNewTransactionData =
        await this.transactionService.addNewTransaction(
          req,
          res,
          addNewTransactionRequestDto,
        );
      return addNewTransactionData;
    } catch (error) {
      Logger.error.error(
        'transaction.controller --> addNewTransaction() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/withdrawal-request')
  public async withdrawalRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Body() withdrawalRequestRequestDto: WithdrawalRequestRequestDto,
  ): Promise<any> {
    Logger.access.info(
      'transaction.controller --> info of withdrawalRequest()',
    );
    try {
      const withdrawalRequestData =
        await this.transactionService.withdrawalRequest(
          req,
          res,
          withdrawalRequestRequestDto,
        );
      return withdrawalRequestData;
    } catch (error) {
      Logger.error.error(
        'transaction.controller --> withdrawalRequest() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
