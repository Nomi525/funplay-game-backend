import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ collection: 'Role', timestamps: true })
export class Role {
  @Prop({ required: false })
  roleName: string;

  @Prop({ default: false })
  permission: {
    edit: boolean;
    delete: boolean;
    create: boolean;
  };

  @Prop()
  permissionType: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  is_deleted: number;
}

const RoleSchema = SchemaFactory.createForClass(Role);
export default RoleSchema;
