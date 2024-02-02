// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Employee } from '../entities/employee.entity';

// @Injectable()
// export default class EmployeeRepository {
//   constructor(
//     @InjectRepository(Employee)
//     private readonly employeeRepository: Repository<Employee>,
//   ) {}

//   // /**
//   //  * Gets a list of Employee
//   //  * @returns {Promise<Employee[] | []>} A list of employee
//   //  */
//   // public async findAllEmployeeList(): Promise<Employee[] | []> {
//   //   console.log('repo ->');
//   //   // const sp = `select * from "allocations"`;
//   //   // // const res = await this.employeeRepository.find({
//   //   // //   where: { status: 'Active' },
//   //   // // });

//   //   const res = await this.employeeRepository
//   //     .createQueryBuilder('employee')
//   //     .leftJoinAndSelect('emplyee.');

//   //   return res;
//   // }
// }

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from '../entities/employee.entity';

@Injectable()
export default class EmployeeRepository {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<Employee>,
  ) {}

  // /**
  //  * Gets a list of Employee
  //  * @returns {Promise<Employee[] | []>} A list of employee
  //  */
  // public async findAllEmployeeList(): Promise<Employee[] | []> {
  //   console.log('repo ->');
  //   // const sp = `select * from "allocations"`;
  //   // // const res = await this.employeeRepository.find({
  //   // //   where: { status: 'Active' },
  //   // // });

  //   const res = await this.employeeModel.find().exec();

  //   return res;
  // }
}
