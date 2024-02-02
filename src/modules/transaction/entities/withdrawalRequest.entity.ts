import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ collection: 'WithdrawalRequest', timestamps: true })
export class WithdrawalRequest extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ required: false })
  walletAddress: string;

  @Prop({ required: false })
  tokenName: string;

  @Prop({ type: Number, required: false })
  tokenAmount: number;

  @Prop({ required: false })
  tokenValue: string;

  @Prop({ required: false })
  tetherType: string;

  @Prop({ type: Number, default: 0 })
  coin: number;

  @Prop({
    type: String,
    enum: ['pending', 'accept', 'reject'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Number, default: 0 })
  is_deleted: number;
}

const WithdrawalRequestSchema = SchemaFactory.createForClass(WithdrawalRequest);
export default WithdrawalRequestSchema;
