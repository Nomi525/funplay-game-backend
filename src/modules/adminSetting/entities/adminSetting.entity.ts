import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'AdminSetting', timestamps: true })
export class AdminSetting extends Document {
  @Prop({ default: 0 })
  withdrawalAmount: number;

  @Prop({ default: 0 })
  minimumBalance: number;

  @Prop({ default: 0 })
  rewardsPoints: number;

  @Prop({ default: 0 })
  joiningBonus: number;

  @Prop({ default: 0 })
  bettingPenalty: number;

  @Prop()
  walletAddress: string;

  @Prop({ default: 0 })
  oneCoinRupes: number;

  @Prop({ default: 0 })
  oneRupesCoin: number;

  @Prop()
  currency: string;

  @Prop()
  currencyValue: number;

  @Prop()
  coin: number;

  @Prop({ default: 0 })
  is_deleted: number;
}

const AdminSettingSchema = SchemaFactory.createForClass(AdminSetting);
export default AdminSettingSchema;
