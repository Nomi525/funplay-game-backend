import { Module, forwardRef } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './controllers/employee.controller';
import EmployeeRepository from './repository/employee.repository';
import { EmployeeService } from './services/employee.service';
import { AllocationModule } from '../allocation/allocation.module';
import { MongooseModule } from '@nestjs/mongoose';
import EmployeeSchema, { Employee } from './entities/employee.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]), // Updated for correct import
    forwardRef(() => AllocationModule),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeRepository, EmployeeService],
  exports: [EmployeeRepository, EmployeeService],
})
export class EmployeeModule {}
