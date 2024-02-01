import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ collection: 'NewTransaction', timestamps: true })
export class NewTransaction extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: false })
  walletAddress: string;

  @Prop({ type: [String], required: false })
  bitcoinWalletAddress: string[];

  @Prop({ type: [String], required: false })
  ethereumWalletAddress: string[];

  @Prop({ required: false })
  networkChainId: string;

  @Prop({ type: String, default: '0' })
  tokenBitcoin: string;

  @Prop({ type: String, default: '0' })
  tokenBNB: string;

  @Prop({ type: String, default: '0' })
  tokenBUSD: string;

  @Prop({ type: String, default: '0' })
  tokenEthereum: string;

  @Prop({ type: String, default: '0' })
  tokenEthereumUSDT: string;

  @Prop({ type: String, default: '0' })
  tokenPolygon: string;

  @Prop({ type: String, default: '0' })
  tokenPolygonUSDT: string;

  @Prop({ type: String, default: '0' })
  tokenDollarValue: string;

  @Prop({ type: String, default: '0' })
  blockDollar: string;

  @Prop({ type: String, default: '0' })
  blockAmount: string;

  @Prop({ type: String, default: '0' })
  betAmount: string;

  @Prop({ type: Number, default: 0 })
  totalCoin: number;

  @Prop({ type: Number, default: 0 })
  blockCoin: number;

  @Prop({ type: Number, default: 0 })
  is_deleted: number;
}

const NewTransactionSchema = SchemaFactory.createForClass(NewTransaction);
export default NewTransactionSchema;
