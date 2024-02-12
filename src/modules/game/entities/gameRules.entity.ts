// game-rules.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'GameRules', timestamps: true })
export class GameRules extends Document {
  @Prop()
  gameId: string;

  @Prop()
  gameName: string;

  @Prop()
  gameRules: string;

  @Prop({ default: 0 })
  is_deleted: number;
}

const gameRulesSchema = SchemaFactory.createForClass(GameRules);
export default gameRulesSchema;
