import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto implements Readonly<CreateNotificationDto> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  to: string[];

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cc?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bcc?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  employeeName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  timesheetName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  projectManagerName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  list?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  allocationPercentage?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  projectName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  billingType?: string;
}
export interface ReplacementParameters {
  eventType: string;
  to: string[];
  subject: string;
  cc?: string[];
  bcc?: string[];
  employeeName?: string;
  url?: string;
  timesheetName?: string;
  comment?: string;
  startDate?: string;
  endDate?: string;
  projectManagerName?: string;
  list?: string;
  allocationPercentage?: string;
  projectName?: string;
  billingType?: string;
}
