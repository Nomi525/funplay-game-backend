import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ collection: 'Period', timestamps: true })
export class Period extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Game' })
  gameId: string;

  @Prop({ type: Number, required: false, index: true })
  period: number;

  @Prop({ type: Date, required: false })
  date: Date;

  @Prop({ type: Number, required: false })
  startTime: number;

  @Prop({ type: Number, required: false })
  endTime: number;

  @Prop({
    type: String,
    enum: ['30', '60', '80', '120', '180'],
    required: false,
  })
  periodFor: string;

  @Prop({ type: Number, default: 0 })
  is_deleted: number;
}

const PeriodSchema = SchemaFactory.createForClass(Period);
export default PeriodSchema;
