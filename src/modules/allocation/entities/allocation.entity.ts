// import { IsNotEmpty, IsString } from 'class-validator';
// import { Employee } from 'src/modules/employee/entities/employee.entity';
// import { Project } from 'src/modules/project/entities/project.entity';
// import {
//   BaseEntity,
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// @Entity({
//   name: 'allocations',
// })
// export class Allocation extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id?: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'zoho_id',
//   })
//   @IsString()
//   @IsNotEmpty()
//   zoho_id: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'projectId',
//   })
//   @IsString()
//   @IsNotEmpty()
//   projectId: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'allocationStatus',
//   })
//   @IsString()
//   @IsNotEmpty()
//   allocationStatus: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'allocation',
//   })
//   @IsString()
//   @IsNotEmpty()
//   allocation: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'allocationType',
//   })
//   @IsString()
//   @IsNotEmpty()
//   allocationType: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'employeeEmail',
//     unique: true,
//   })
//   @IsString()
//   @IsNotEmpty()
//   employeeEmail: string;

//   @Column({
//     type: 'timestamptz',
//     nullable: false,
//     name: 'startDate',
//   })
//   // @Transform((startDate) => moment(startDate).format('dd-mon-yyyy'))
//   @IsString()
//   @IsNotEmpty()
//   startDate: Date;

//   @Column({
//     type: 'timestamptz',
//     nullable: false,
//     name: 'endDate',
//   })
//   @IsString()
//   @IsNotEmpty()
//   endDate: Date;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'billing_status',
//   })
//   @IsString()
//   @IsNotEmpty()
//   billing_status: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'project_role',
//   })
//   @IsString()
//   @IsNotEmpty()
//   project_role: string;

//   @ManyToOne(() => Project, { nullable: true })
//   @JoinColumn({ name: 'projectId', referencedColumnName: 'zoho_id' })
//   project: Project;

//   @ManyToOne(() => Employee)
//   @JoinColumn({ name: 'employeeEmail', referencedColumnName: 'email' })
//   employee: Employee;
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { Employee } from 'src/modules/employee/entities/employee.entity';

@Schema({
  collection: 'allocations',
})
export class Allocation extends Document {
  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  zoho_id: string;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  allocationStatus: string;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  allocation: string;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  allocationType: string;

  @Prop({ type: String, required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  employeeEmail: string;

  @Prop({ type: Date, required: true })
  @IsString()
  @IsNotEmpty()
  startDate: Date;

  @Prop({ type: Date, required: true })
  @IsString()
  @IsNotEmpty()
  endDate: Date;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  billing_status: string;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  project_role: string;

  // @Prop({
  //   type: String,
  //   ref: 'Project',
  //   foreignField: 'zoho_id',
  //   localField: 'projectId',
  //   autopopulate: true,
  // })
  // project: Project;

  @Prop({
    type: String,
    ref: 'Employee',
    foreignField: 'email',
    localField: 'employeeEmail',
    autopopulate: true,
  })
  employee: Employee;
}

const AllocationSchema = SchemaFactory.createForClass(Allocation);

export default AllocationSchema;
