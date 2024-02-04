import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Game', timestamps: true })
export class Game extends Document {
  @Prop({ required: false })
  gameName: string;

  @Prop({ required: false })
  gameImage: string;

  @Prop({ required: false })
  gameStartDate: Date;

  @Prop({ required: false })
  gameEndDate: Date;

  @Prop({ required: false })
  gameRound: number;

  @Prop({ required: false, default: 0 })
  gameWinningAmount: number;

  @Prop({ required: false })
  gameHours: string;

  @Prop({ required: false })
  gameTimeFrom: Date;

  @Prop({ required: false })
  gameTimeTo: Date;

  @Prop({ required: false })
  gameDurationFrom: string;

  @Prop({ required: false })
  gameDurationTo: string;

  @Prop({ required: false })
  gameMode: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  gameMinimumCoin: number;

  @Prop({ required: false })
  gameMaximumCoin: number;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: false })
  gameSecond: string[];

  @Prop({ required: false, default: false })
  isRepeat: boolean;

  @Prop({ required: false })
  iconImage: string;

  @Prop({ required: false, default: 0 })
  betAmount: number;

  @Prop({ required: false, default: 0 })
  noOfWinners: number;

  @Prop({ required: false, default: [0] })
  winnersPercentage: number[];

  @Prop({ required: false, default: 0 })
  entryFee: number;

  @Prop({ required: false, default: 0 })
  winningCoin: number;

  @Prop({ required: false, default: 0 })
  is_deleted: number;

  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = SchemaFactory.createForClass(Game);
export default GameSchema;
