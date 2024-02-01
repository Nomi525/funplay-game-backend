import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'Reward',
  timestamps: true,
})
export class RewardUser extends Document {
  @Prop({ type: String, ref: 'User', required: false })
  userId: string;

  @Prop({ required: false })
  title: string;

  @Prop({ type: Number, default: 0 })
  points: number;

  @Prop({ required: false })
  description: string;

  @Prop({ default: false })
  redeemed: boolean;

  @Prop({ default: 0 })
  is_deleted: number;
}

const RewardUserSchema = SchemaFactory.createForClass(RewardUser);
export default RewardUserSchema;
