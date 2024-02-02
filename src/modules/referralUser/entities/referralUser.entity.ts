import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Schema({ collection: 'ReferralUser', timestamps: true })
export class ReferralUser extends Document {
  @Prop({ type: User, ref: 'User' })
  userId: string;

  @Prop({ type: User, ref: 'User' })
  referralUser: string;

  @Prop()
  referralByCode: string;
}

const ReferralUserSchema = SchemaFactory.createForClass(ReferralUser);
export default ReferralUserSchema;
