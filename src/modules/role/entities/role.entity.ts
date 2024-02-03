import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Role', timestamps: true })
export class Role extends Document {
  @Prop({ required: false })
  roleName: string;

  @Prop({
    type: {
      edit: Boolean,
      delete: Boolean,
      create: Boolean,
    },
    required: false,
    default: {
      edit: false,
      delete: false,
      create: false,
    },
  })
  permission: {
    edit: boolean;
    delete: boolean;
    create: boolean;
  };

  @Prop({ type: [String], required: false })
  permissionType: string[];

  @Prop({ default: true, required: false })
  isActive: boolean;

  @Prop({ default: 0 })
  is_deleted: number;
}

const RoleSchema = SchemaFactory.createForClass(Role);
export default RoleSchema;
