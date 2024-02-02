import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ collection: 'TransactionHistory', timestamps: true })
export class TransactionHistory extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ required: false })
  walletAddress: string;

  @Prop({ required: false })
  networkChainId: string;

  @Prop({ required: false })
  tokenName: string;

  @Prop({ type: Number, default: 0 })
  tokenAmount: number;

  @Prop({ type: Number, default: 0 })
  tokenDollorValue: number;

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

  @Prop({ required: false })
  type: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: Number, default: 0 })
  is_deleted: number;
}

const TransactionHistorySchema =
  SchemaFactory.createForClass(TransactionHistory);
export default TransactionHistorySchema;
