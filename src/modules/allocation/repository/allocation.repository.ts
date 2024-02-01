// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Allocation } from '../entities/allocation.entity';
// import Logger from 'src/core/Logger';

// @Injectable()
// export default class AllocationRepository {
//   constructor(
//     @InjectRepository(Allocation)
//     private readonly allocationRepository: Repository<Allocation>,
//   ) {}

//   /**
//    * get list of active allocation for resigned employees
//    * @return {Promise<Allocation[] | []>} allocation list
//    */
//   public async findAllocationStatus(): Promise<Allocation[] | []> {
//     try {
//       return [];
//       // await this.allocationRepository
//       //   .createQueryBuilder('allocation')
//       //   .where('e.relievingDate is not null')
//       //   .andWhere('allocation.endDate ::date > e.relievingDate ::date')
//       //   .innerJoin('allocation.employee', 'e')
//       //   .innerJoin('allocation.project', 'p')
//       //   .select([
//       //     'e.firstname',
//       //     'e.lastname',
//       //     'e.status',
//       //     'e.relievingDate',
//       //     'p.name',
//       //     'allocation.startDate',
//       //     'allocation.endDate',
//       //   ])
//       //   .orderBy('e.relievingDate', 'DESC')
//       //   .addOrderBy('e.firstname', 'DESC')
//       //   .addOrderBy('e.lastname', 'DESC')
//       //   .getMany();
//     } catch (error: any) {
//       Logger.error.error(
//         'Allocation.repository --> in findAllocationStatus() indicates error',
//         error.message,
//       );
//       throw new BadRequestException(error.message);
//     }
//   }
// }

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Allocation } from '../entities/allocation.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import Logger from 'src/core/Logger';

@Injectable()
export default class AllocationRepository {
  constructor(
    @InjectModel(Allocation.name)
    private readonly allocationModel: Model<Allocation>,
  ) {}

  /**
   * get list of active allocation for resigned employees
   * @return {Promise<Allocation[] | []>} allocation list
   */
  public async findAllocationStatus(): Promise<Allocation[] | []> {
    try {
      return await this.allocationModel.find().exec();
      // You can add any additional query conditions or transformations here
    } catch (error: any) {
      Logger.error.error(
        'Allocation.repository --> in findAllocationStatus() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
