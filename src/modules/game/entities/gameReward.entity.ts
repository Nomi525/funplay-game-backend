import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ collection: 'GameReward', timestamps: true })
export class GameReward extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Game', required: false })
  gameId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'ColourBetting',
    required: false,
  })
  betId: string;

  @Prop({ required: false })
  colourName: string;

  @Prop({ required: false, default: 0 })
  betAmount: string;

  @Prop({ required: false, default: 0 })
  rewardAmount: number;

  @Prop({ required: false, default: 0 })
  is_deleted: number;
}

const GameRewardSchema = SchemaFactory.createForClass(GameReward);
export default GameRewardSchema;
