// import { Module, forwardRef } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AllocationController } from './controllers/allocation.controller';
// import { Allocation } from './entities/allocation.entity';
// import AllocationRepository from './repository/allocation.repository';
// import { AllocationService } from './services/allocation.service';
// import { EmployeeModule } from '../employee/employee.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Allocation]),
//     forwardRef(() => EmployeeModule),
//   ],
//   controllers: [AllocationController],
//   providers: [AllocationRepository, AllocationService],
//   exports: [AllocationService, AllocationRepository],
// })
// export class AllocationModule {}

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModule } from '../employee/employee.module';
import { AllocationController } from './controllers/allocation.controller';
import AllocationSchema, { Allocation } from './entities/allocation.entity';
import { AllocationService } from './services/allocation.service';
import AllocationRepository from './repository/allocation.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Allocation.name, schema: AllocationSchema },
    ]), // Updated for correct import
    forwardRef(() => EmployeeModule),
  ],
  controllers: [AllocationController],
  providers: [AllocationRepository, AllocationService],
  exports: [AllocationService, AllocationRepository],
})
export class AllocationModule {}
