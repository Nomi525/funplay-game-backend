// currency.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Currency', timestamps: true })
export class Currency extends Document {
  @Prop({ required: false })
  currencyName: string;

  @Prop({ required: false })
  currencyCode: string;

  @Prop({ required: false })
  currencySymbol: string;

  @Prop({ default: 0 })
  is_deleted: number;
}

const CurrencySchema = SchemaFactory.createForClass(Currency);
export default CurrencySchema;
