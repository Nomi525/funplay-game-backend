import { Controller } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // /**
  //  * get all employee list
  //  * @return {Promise<Employee[] | []>} all employee list
  //  */
  // @Get()
  // public async getEmployees(): Promise<Employee[] | []> {
  //   console.log('controller ---> ');

  //   const employees = await this.employeeService.getEmployees();
  //   // if (employees.length <= 0)
  //   //   throw new NotFoundException(employeeEnum.EMPLOYEE_NOT_EXIST);
  //   return employees;
  // }
}
