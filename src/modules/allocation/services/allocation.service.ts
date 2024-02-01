import { BadRequestException, Injectable } from '@nestjs/common';
import Logger from 'src/core/Logger';
import { ResigendEmployeesAllocationResponse } from '../dto/allocation.dto';
import { Allocation } from '../entities/allocation.entity';
import AllocationRepository from '../repository/allocation.repository';

@Injectable()
export class AllocationService {
  constructor(private readonly allocationRepository: AllocationRepository) {}

  public async allocationStatusForResignedEmployees(): Promise<
    ResigendEmployeesAllocationResponse[] | []
  > {
    Logger.access.info(
      'allocationStatusForResignedEmployees method entry in --> Allocation.service',
    );
    try {
      const result = await this.allocationRepository.findAllocationStatus();
      const resignedEmployeesAllocations = await Promise.all(
        result.map(async (item: Allocation) => {
          const allocationObj = {
            firstName: item.employee.firstname,
            lastName: item.employee.lastname,
            status: item.employee.status,
            relievingDate: item.employee.relievingDate.toDateString(),
            // projectName: item.project.name,
            allocationStartDate: item.startDate.toDateString(),
            allocationEndDate: item.endDate.toDateString(),
          };
          return allocationObj;
        }),
      );
      console.log({ resignedEmployeesAllocations });

      Logger.access.info(
        'Allocation.service --> allocationStatusForResignedEmployees()',
        resignedEmployeesAllocations,
      );
      return resignedEmployeesAllocations;
    } catch (error: any) {
      Logger.error.error(
        'Allocation.service --> in allocationStatusForResignedEmployees() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
