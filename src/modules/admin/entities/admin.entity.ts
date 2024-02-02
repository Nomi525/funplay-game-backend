import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ collection: 'Admin', timestamps: true })
export class Admin extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, lowercase: true })
  email: string;

  @Prop()
  mobileNumber: number;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isLogin: boolean;

  @Prop({ default: false })
  resetPasswordAllow: boolean;

  @Prop()
  otp: string;

  @Prop()
  profile: string;

  @Prop()
  address: string;

  @Prop()
  deviceId: string;

  @Prop()
  ipAddress: string;

  @Prop()
  deviceName: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' })
  role: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  is_deleted: number;

  @Prop({ default: false })
  isAdmin: boolean;
}

const AdminSchema = SchemaFactory.createForClass(Admin);
export default AdminSchema;
