import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common';
import Logger from 'src/core/Logger';
import { AllocationEnum } from '../constants/enum/allocation.enum';
import { ResigendEmployeesAllocationResponse } from '../dto/allocation.dto';
import { AllocationService } from '../services/allocation.service';

@Controller('allocation')
export class AllocationController {
  constructor(private readonly allocationService: AllocationService) {}

  /**
   * get list of active allocation for resigned employees
   * @return {Promise<ResigendEmployeesAllocationResponse[] | []>} resigned employees allocation list
   */
  @Get('allocationStatusForResignedEmployees')
  public async getAllocationStatusForResignedEmployees(): Promise<
    ResigendEmployeesAllocationResponse[] | []
  > {
    try {
      Logger.access.info(
        'Allocation.controller --> allocation status for resigned employees',
      );
      const allocationStatus =
        await this.allocationService.allocationStatusForResignedEmployees();

      if (!allocationStatus.length) {
        throw new NotFoundException(AllocationEnum.ALLOCATION_NOT_EXIST);
      }
      return allocationStatus;
    } catch (error: any) {
      Logger.error.error(
        'From allocationStatusForResignedEmployees() in Allocation.controller',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
