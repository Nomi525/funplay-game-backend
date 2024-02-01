// import { ApiProperty } from '@nestjs/swagger';
// import { Transform } from 'class-transformer';
// import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
// import { Employee } from '../entities/employee.entity';
// export class CreateEmployeeDto implements Readonly<CreateEmployeeDto> {
//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   zoho_id: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   firstname: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   lastname: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   confirmStatus: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   department: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   designation: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   capablity: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   email: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   status: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   employeeId: string;

//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   reportingTo: string;

//   @ApiProperty({ required: true })
//   @IsNotEmpty()
//   joiningDate: string;

//   @ApiProperty({ required: true })
//   confirmationDate: string;

//   @ApiProperty({ required: true })
//   relievingDate: string;

//   @ApiProperty({ required: true })
//   @IsBoolean()
//   @IsNotEmpty()
//   @Transform(({ value }) => value === 'true')
//   BUHead: boolean;

//   @ApiProperty({ required: true })
//   @IsNumber()
//   @IsNotEmpty()
//   totalExperience: number;

//   //   public static from(dto: Partial<CreateEmployeeDto>) {
//   //     const employee = new CreateEmployeeDto();
//   //     return { ...employee, ...dto };
//   //   }

//   //   public static fromEntity(entity: Employee) {
//   //     return this.from(entity);
//   //   }
// }

// export class UpdateEmployeeDto extends CreateEmployeeDto {
//   @ApiProperty({ required: true })
//   @IsString()
//   @IsNotEmpty()
//   id: string;
// }

// export class DeleteEmployeeDto implements Readonly<DeleteEmployeeDto> {
//   @ApiProperty({ required: false })
//   affected?: number | null | undefined;

//   @ApiProperty({ required: false })
//   raw?: any;
// }

// export interface EmployeeDtos {
//   readonly id: string;
//   readonly zoho_id: string;
//   readonly email: string;
//   readonly confirmStatus: string;
//   readonly department: string;
//   readonly designation: string;
//   readonly capablity: string;
//   readonly employeeId: string;
//   readonly firstname: string;
//   readonly lastname: string;
//   readonly status: string;
//   readonly reportingTo: string;
//   readonly joiningDate: string;
//   readonly confirmationDate?: string;
//   readonly relievingDate?: string;
//   readonly BUHead: boolean;
//   readonly totalExperience: number;
// }
