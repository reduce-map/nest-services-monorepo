import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserAccount } from './user-account.schema';

@Schema()
export class LoginAttempt {
  @Prop({
    type: Types.ObjectId,
    ref: UserAccount.name,
    required: true,
    index: true,
    expires: '30d',
  })
  userAccount!: string;

  @Prop({ type: Date, default: Date.now, required: true })
  attemptTime!: Date;

  @Prop({ type: Boolean, required: true })
  isSuccess!: boolean;

  @Prop({ type: String, required: true })
  address!: string;

  @Prop({ String, required: true })
  attemptLocation!: string;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);
