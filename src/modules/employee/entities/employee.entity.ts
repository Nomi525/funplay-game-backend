import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// import {
//   BaseEntity,
//   Column,
//   Entity,
//   JoinColumn,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';

// @Entity({
//   name: 'employees',
// })
// export class Employee extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'zoho_id',
//   })
//   zoho_id: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'firstname',
//   })
//   firstname: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'lastname',
//   })
//   lastname: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'confirmStatus',
//   })
//   confirmStatus: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'department',
//   })
//   department: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'designation',
//   })
//   designation: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'capablity',
//   })
//   capablity: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'email',
//   })
//   email: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'status',
//   })
//   status: string;

//   @Column({
//     type: 'text',
//     nullable: false,
//     name: 'employeeId',
//   })
//   employeeId: string;

//   @Column({
//     type: 'text',
//     nullable: true,
//     name: 'reportingTo',
//   })
//   reportingTo: string;

//   @Column({
//     type: 'timestamp with time zone',
//     nullable: false,
//     name: 'joiningDate',
//   })
//   joiningDate: Date | string;

//   @Column({
//     type: 'timestamp with time zone',
//     nullable: true,
//     name: 'confirmationDate',
//   })
//   confirmationDate: Date;

//   @Column({
//     type: 'timestamp with time zone',
//     nullable: true,
//     name: 'relievingDate',
//   })
//   relievingDate: Date;

//   @Column({
//     type: 'boolean',
//     nullable: false,
//     name: 'BUHead',
//     default: false,
//   })
//   BUHead: boolean;

//   @Column({
//     type: 'int',
//     nullable: true,
//     default: 0,
//     name: 'totalExperience',
//   })
//   totalExperience: number;

//   @OneToOne(() => Employee, { nullable: true })
//   @JoinColumn({
//     name: 'reportingTo',
//     referencedColumnName: 'employeeId',
//   })
//   reporter: Employee;
// }

@Schema({
  collection: 'employees',
})
export class Employee extends Document {
  @Prop({ type: MongooseSchema.Types.String, required: true })
  zoho_id: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  firstname: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  lastname: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  confirmStatus: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  department: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  designation: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  capablity: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  email: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  status: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  employeeId: string;

  @Prop({ type: MongooseSchema.Types.String, required: false })
  reportingTo: string;

  @Prop({ type: MongooseSchema.Types.Date, required: true })
  joiningDate: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: false })
  confirmationDate: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: false })
  relievingDate: Date;

  @Prop({ type: MongooseSchema.Types.Boolean, default: false })
  BUHead: boolean;

  @Prop({ type: MongooseSchema.Types.Number, required: false, default: 0 })
  totalExperience: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Employee',
    required: false,
  })
  reporter: string; // Assuming reporter is the reference to another Employee document
}

const EmployeeSchema = SchemaFactory.createForClass(Employee);

export default EmployeeSchema;
