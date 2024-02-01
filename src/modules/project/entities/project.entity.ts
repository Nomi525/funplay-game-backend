/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
  name: 'projects',
})
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    //@ts-ignore
    type: 'text',
    allowNull: false,
    name: 'zoho_id',
  })
  @IsString()
  @IsNotEmpty()
  zoho_id: string;

  @Column({
    //@ts-ignore
    type: 'text',
    allowNull: false,
    name: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'jsonb',
    nullable: false,
    name: 'projectHead',
  })
  @IsNotEmpty()
  projectHead: string | string[];

  @Column({
    type: 'jsonb',
    nullable: false,
    name: 'projectManager',
  })
  @IsNotEmpty()
  projectManager: string | string[];

  @Column({
    type: 'text',
    nullable: false,
    name: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'users',
  })
  users: string | string[];

  @Column({
    //@ts-ignore
    type: 'boolean',
    allowNull: true,
    name: 'isUsShiftAllowed',
  })
  @IsBoolean()
  isUsShiftAllowed: boolean;

  @Column({
    //@ts-ignore
    type: 'boolean',
    allowNull: true,
    name: 'isUkShiftAllowed',
  })
  @IsBoolean()
  isUkShiftAllowed: boolean;

  @Column({
    //@ts-ignore
    type: 'boolean',
    allowNull: true,
    name: 'isWeekendAllowed',
  })
  @IsBoolean()
  isWeekendAllowed: boolean;

  @Column({
    //@ts-ignore
    type: 'text',
    allowNull: true,
    name: 'clientName',
  })
  clientName: string;
}
