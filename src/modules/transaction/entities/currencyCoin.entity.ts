import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'CurrencyCoin', timestamps: true })
export class CurrencyCoin extends Document {
  @Prop({ required: false })
  currencyName: string;

  @Prop({ required: false })
  coin: number;

  @Prop({ required: false })
  price: number;

  @Prop({ default: 0 })
  is_deleted: number;
}

const CurrencyCoinSchema = SchemaFactory.createForClass(CurrencyCoin);
export default CurrencyCoinSchema;
