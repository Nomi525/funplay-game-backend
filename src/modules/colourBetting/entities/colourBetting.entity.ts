import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ColourBettingDocument = ColourBetting & Document;

@Schema({ collection: 'ColourBetting', timestamps: true })
export class ColourBetting {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Game', required: false })
  gameId: string;

  @Prop({ required: false })
  colourName: string;

  @Prop({ required: false })
  betAmount: number;

  @Prop({ required: false })
  totalAmount: number;

  @Prop({ required: false })
  count: number;

  @Prop({ required: false, default: 0 })
  period: number;

  @Prop({ required: false, default: 0 })
  rewardAmount: number;

  @Prop({ required: false, default: 0 })
  lossAmount: number;

  @Prop({ required: false })
  gameType: string;

  @Prop({ required: false })
  selectedTime: string;

  @Prop({ required: false, default: false })
  isWin: boolean;

  @Prop({
    enum: [null, 'fail', 'pending', 'successfully'],
    required: false,
    default: null,
  })
  status: string;

  @Prop({ required: false, default: 0 })
  is_deleted: number;
}

const ColourBettingSchema = SchemaFactory.createForClass(ColourBetting);

export default ColourBettingSchema;
