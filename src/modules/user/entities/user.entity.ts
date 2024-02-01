import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  userRegisterTypeEnum,
  userWalletTypeEnum,
} from '../constants/enums/user.enum';

@Schema({
  collection: 'Users',
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: false })
  fullName: string;

  @Prop({ lowercase: true, required: false, default: null })
  email: string;

  @Prop({ required: false })
  userName: string;

  @Prop({ unique: true })
  mobileNumber: number;

  @Prop({ required: false })
  referralCode: string;

  @Prop({ type: Number })
  mPin: number;

  @Prop({ required: false, default: null })
  password: string;

  @Prop({ default: false })
  isLogin: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  resetPasswordAllow: boolean;

  @Prop({ type: Number, default: null })
  otp: number;

  @Prop({ type: Number, default: null })
  forgotOtp: number;

  @Prop({ required: false })
  profile: string;

  @Prop({ required: false })
  address: string;

  @Prop([
    {
      walletAddress: { type: String, required: false },
      walletType: {
        type: String,
        required: false,
        enum: [userWalletTypeEnum.WEB3MODEL, userWalletTypeEnum.MAGIC],
      },
      isConnected: { type: Boolean, required: false, default: false },
    },
  ])
  wallet: {
    walletAddress: string;
    walletType: userWalletTypeEnum.WEB3MODEL | userWalletTypeEnum.MAGIC;
    isConnected: boolean;
  }[];

  @Prop({ default: 'No' })
  walletConnected: string;

  @Prop({
    type: Object,
    bankDetails: {
      bankName: { type: String, required: false },
      branch: { type: String, required: false },
      accountHolder: { type: String, required: false },
      accountNumber: { type: Number, required: false },
      IFSCCode: { type: String, required: false },
    },
  })
  bankDetails: {
    bankName: string;
    branch: string;
    accountHolder: string;
    accountNumber: number;
    IFSCCode: string;
  };

  @Prop({ required: false })
  currency: string;

  @Prop({
    enum: [userRegisterTypeEnum.OTP, userRegisterTypeEnum.PASSWORD],
    required: false,
  })
  registerType: userRegisterTypeEnum.OTP | userRegisterTypeEnum.PASSWORD;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  is_deleted: number;
}

const UserSchema = SchemaFactory.createForClass(User);
export default UserSchema;
