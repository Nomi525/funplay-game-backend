// game-time.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'GameTime', timestamps: true })
export class GameTime extends Document {
  @Prop()
  gameId: string;

  @Prop([String]) // Indicates an array of strings
  gameTime: string[];

  @Prop({ default: 0 })
  is_deleted: number;
}

const gameTimeSchema = SchemaFactory.createForClass(GameTime);
export default gameTimeSchema;
