import { Injectable } from '@nestjs/common';
import EmployeeRepository from '../repository/employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  // public async getEmployees(): Promise<Employee[] | []> {
  //   console.log('service -->');

  //   return await this.employeeRepository.findAllEmployeeList();
  // }
}
